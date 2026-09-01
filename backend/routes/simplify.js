const express = require('express');
const axios = require('axios');

const router = express.Router();
const SARVAM_BASE = 'https://api.sarvam.ai';

// Grade level → friendly reading instruction
const GRADE_PROMPTS = {
  '1-2': 'Rewrite this lesson for Class 1-2 students (ages 6-7). Use very simple words, short sentences (max 8 words each), and one idea per sentence. Avoid any technical terms.',
  '3-5': 'Rewrite this lesson for Class 3-5 students (ages 8-10). Use simple, clear language. Each sentence should be concise. You may introduce one or two key terms but define them immediately.',
  '6-8': 'Rewrite this lesson for Class 6-8 students (ages 11-13). Use clear, precise language. You may use subject-specific vocabulary but keep sentences readable. Organize into short paragraphs.',
};

/**
 * POST /api/simplify
 * Body: { text: string, gradeLevel: "1-2" | "3-5" | "6-8" }
 * Returns: { simplified: string }
 */
router.post('/', async (req, res, next) => {
  const { text, gradeLevel } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: '"text" field is required' });
  }
  const level = gradeLevel || '3-5';
  const gradeInstruction = GRADE_PROMPTS[level] || GRADE_PROMPTS['3-5'];

  // ── MOCK MODE ─────────────────────────────────────────────────────────────
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    console.log('[Simplify] Mock mode — returning fake simplified text');
    return res.json({
      simplified: `(Mock Class ${level}) पेड़ सूरज की रोशनी से खाना बनाते हैं। इसे प्रकाश संश्लेषण कहते हैं।`,
      mock: true,
    });
  }

  // ── REAL SARVAM CALL ──────────────────────────────────────────────────────
  try {
    const response = await axios.post(
      `${SARVAM_BASE}/v1/chat/completions`,
      {
        model: 'sarvam-105b-conversations',
        messages: [
          {
            role: 'system',
            content: `You are an educational content writer for Indian primary schools. ${gradeInstruction} Respond with ONLY the rewritten text. Do not include any explanation, notes, headers, bullet points, numbering, or quotation marks. Just the simplified lesson text itself.`,
          },
          {
            role: 'user',
            content: `Rewrite this lesson:\n\n${text}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 512,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        timeout: 30000,
      }
    );

    const msg = response.data.choices?.[0]?.message;
    // sarvam-105b may put the answer in content OR reasoning_content (thinking mode)
    const simplified = (msg?.content?.trim()) || (msg?.reasoning_content?.trim());
    if (!simplified) {
      console.error('[Simplify] Full response:', JSON.stringify(response.data, null, 2));
      throw new Error('Empty response from model');
    }
    return res.json({ simplified });
  } catch (err) {
    console.error('[Simplify] Sarvam error:', err.response?.data || err.message);
    return next({
      status: err.response?.status || 502,
      message: err.response?.data?.message || 'Text simplification failed',
    });
  }
});

module.exports = router;
