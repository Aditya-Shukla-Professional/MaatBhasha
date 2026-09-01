// translate.js — Server-side translation proxy to Sarvam AI
// Security: API key is read from env only — never exposed to frontend
// Supported pairs: hi-IN ↔ sat-IN (Santali Ol Chiki)

const express = require('express');
const axios   = require('axios');

const router = express.Router();
const SARVAM_BASE     = 'https://api.sarvam.ai';
const TRANSLATE_MODEL = 'sarvam-translate:v1';

/**
 * Only these language pairs are production-supported in this prototype.
 * All other tribal languages (Ho, Mundari, Kurukh) are NOT yet integrated.
 */
const SUPPORTED_PAIRS = new Set([
  'hi-IN→sat-IN',   // Hindi teacher → Santali student text
  'sat-IN→hi-IN',   // Santali student reply → Hindi teacher
]);

function pairKey(src, tgt) { return `${src}→${tgt}`; }

function normalizeText(text) {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * POST /api/translate
 * Body: {
 *   text: string              — input text (Hindi or Santali)
 *   sourceLang?: string       — BCP-47, default 'hi-IN'
 *   targetLang?: string       — BCP-47, default 'sat-IN'
 * }
 * Returns: { translated, sourceUsed, targetUsed }
 *
 * IMPORTANT: This route NEVER returns fake/mock Santali text.
 * All errors return structured JSON the frontend maps to Hindi user messages.
 */
router.post('/', async (req, res) => {
  const {
    text,
    sourceLang = 'hi-IN',
    targetLang = 'sat-IN',
  } = req.body;

  // ── Input validation ──────────────────────────────────────────────────────
  const normalized = normalizeText(text);
  if (!normalized) {
    return res.status(400).json({ error: 'TEXT_EMPTY', message: 'Text must not be empty.' });
  }
  if (normalized.length > 4000) {
    return res.status(400).json({ error: 'TEXT_TOO_LONG', message: 'Text must be 4000 characters or fewer.' });
  }
  if (!SUPPORTED_PAIRS.has(pairKey(sourceLang, targetLang))) {
    return res.status(400).json({
      error:   'PAIR_NOT_SUPPORTED',
      message: `${sourceLang} → ${targetLang} is not available. Only hi-IN ↔ sat-IN is supported in this prototype.`,
    });
  }

  // ── API key check ─────────────────────────────────────────────────────────
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    return res.status(503).json({
      error:   'NO_API_KEY',
      message: 'Translation service not configured. Set SARVAM_API_KEY in server .env.',
    });
  }

  // ── Sarvam Translate API call ─────────────────────────────────────────────
  try {
    const response = await axios.post(
      `${SARVAM_BASE}/translate`,
      {
        input:                normalized,
        source_language_code: sourceLang,
        target_language_code: targetLang,
        speaker_gender:       'Female',
        mode:                 'formal',
        model:                TRANSLATE_MODEL,
        enable_preprocessing: true,
      },
      {
        headers: {
          'Content-Type':         'application/json',
          'api-subscription-key': apiKey,
        },
        timeout: 30000,
      }
    );

    const translated = response.data.translated_text;
    if (!translated) throw new Error('Empty translated_text in Sarvam response');

    return res.json({ translated, sourceUsed: sourceLang, targetUsed: targetLang });

  } catch (err) {
    console.error('[Translate] Sarvam error:', err.response?.data || err.message);
    const status = err.response?.status || 502;
    return res.status(status).json({
      error:     'SARVAM_API_ERROR',
      message:   err.response?.data?.message || 'Translation failed. Please try again.',
      retryable: status >= 500,
    });
  }
});

module.exports = router;


