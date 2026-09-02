const express = require('express');
const axios = require('axios');

const router = express.Router();
const SARVAM_BASE = 'https://api.sarvam.ai';

// Languages natively supported by Bulbul v3 for TTS narration
// These are the only ones where we can narrate the translated text directly.
// For all others (Santali Ol Chiki, Ho, Mundari, Kurukh) we narrate in Odia.
const TTS_SUPPORTED = new Set([
  'hi-IN', 'en-IN', 'ta-IN', 'te-IN', 'kn-IN',
  'ml-IN', 'mr-IN', 'gu-IN', 'bn-IN', 'pa-IN', 'od-IN',
]);

const TTS_FALLBACK     = 'od-IN';  // Odia — best regional fallback for Jharkhand
const TRANSLATE_MODEL  = 'sarvam-translate:v1';

/**
 * Translates `text` from `sourceLang` to `targetLang` using Sarvam translate API.
 * Used internally to prepare narration text when the target script can't be spoken.
 */
async function translateForNarration(text, sourceLang, targetLang, apiKey) {
  const res = await axios.post(
    `${SARVAM_BASE}/translate`,
    {
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      speaker_gender: 'Female',
      mode: 'formal',
      model: TRANSLATE_MODEL,
      enable_preprocessing: true,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      timeout: 20000,
    }
  );
  return res.data.translated_text || text; // return original if translation fails
}

/**
 * POST /api/tts
 * Body: {
 *   text: string        — the translated text (may be in any script)
 *   langCode: string    — target language code (e.g. sat-IN, od-IN, hi-IN)
 *   sourceLang?: string — source language of `text` (default: en-IN)
 * }
 * Returns: { audioDataUri: string, fallback: boolean, usedLang: string }
 *
 * If langCode is not speakable by Bulbul v3, we:
 *   1. Translate the ENGLISH simplified text into Odia (narrate-able script)
 *   2. Narrate the Odia text as audio fallback
 *   3. Return fallback: true so the UI shows the badge
 */
router.post('/', async (req, res, next) => {
  const { text, langCode, sourceLang, simplifiedText } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: '"text" field is required' });
  }

  const rawLang    = langCode || 'hi-IN';
  const isFallback = !TTS_SUPPORTED.has(rawLang);
  const usedLang   = isFallback ? TTS_FALLBACK : rawLang;

  // ── MOCK MODE ─────────────────────────────────────────────────────────────
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    console.log('[TTS] Mock mode — returning silent mock audio');
    const SILENT_WAV =
      'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    return res.json({
      audioDataUri: `data:audio/wav;base64,${SILENT_WAV}`,
      fallback: isFallback,
      usedLang,
      mock: true,
    });
  }

  // ── REAL SARVAM CALL ──────────────────────────────────────────────────────
  try {
    let narrateText = text;

    if (isFallback) {
      // The translated text is in an unpronounceable script (e.g. Santali Ol Chiki).
      // We translate the simplified English text → Odia so Bulbul can narrate it.
      // `simplifiedText` is the English output from the simplify step.
      // If not provided, fall back to translating `text` from its source lang.
      const textToConvert = simplifiedText || text;
      const fromLang      = simplifiedText ? 'en-IN' : (sourceLang || 'en-IN');
      console.log(`[TTS] Fallback: translating to Odia for narration (from ${fromLang})`);
      narrateText = await translateForNarration(textToConvert, fromLang, TTS_FALLBACK, apiKey);
    }

    // Bulbul v3 max input is 2500 characters
    const safeText = narrateText.length > 2500
      ? narrateText.slice(0, 2497) + '…'
      : narrateText;

    console.log(`[TTS] Narrating in ${usedLang}, ${safeText.length} chars`);

    const response = await axios.post(
      `${SARVAM_BASE}/text-to-speech`,
      {
        text: safeText,
        language_code: usedLang,
        speaker: 'priya',     // confirmed compatible with bulbul:v3
        pace: 1.0,
        speech_sample_rate: 22050,
        model: 'bulbul:v3',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        timeout: 30000,
      }
    );

    // Sarvam returns { audios: [ "<base64>" ] }
    const base64Audio = response.data.audios?.[0];
    if (!base64Audio) {
      throw new Error('No audio data returned from TTS');
    }

    return res.json({
      audioDataUri: `data:audio/wav;base64,${base64Audio}`,
      fallback: isFallback,
      usedLang,
    });
  } catch (err) {
    console.error('[TTS] Sarvam error:', err.response?.data || err.message);
    return next({
      status: err.response?.status || 502,
      message: err.response?.data?.message || 'Text-to-speech failed',
    });
  }
});

module.exports = router;
