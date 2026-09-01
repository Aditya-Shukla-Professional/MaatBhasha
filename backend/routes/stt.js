const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Store uploads temporarily in memory then clean up
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

const SARVAM_BASE = 'https://api.sarvam.ai';

/**
 * POST /api/stt
 * Body: multipart/form-data  { audio: <file>, language_code?: string }
 * Returns: { transcript: string }
 */
router.post('/', upload.single('audio'), async (req, res, next) => {
  // ── MOCK MODE (no real key set) ───────────────────────────────────────────
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    console.log('[STT] Mock mode — returning fake transcript');
    if (req.file) fs.unlinkSync(req.file.path); // clean up temp file
    return res.json({
      transcript: 'पेड़-पौधे सूरज की रोशनी से अपना खाना खुद बनाते हैं।',
      mock: true,
    });
  }

  // ── REAL SARVAM CALL ──────────────────────────────────────────────────────
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname || 'audio.wav',
      contentType: req.file.mimetype || 'audio/wav',
    });
    form.append('model', 'saaras:v3');
    if (req.body.language_code) {
      form.append('language_code', req.body.language_code);
    }

    const response = await axios.post(`${SARVAM_BASE}/speech-to-text`, form, {
      headers: {
        ...form.getHeaders(),
        'api-subscription-key': apiKey,
      },
      timeout: 30000,
    });

    fs.unlinkSync(req.file.path); // clean up temp file
    return res.json({ transcript: response.data.transcript });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error('[STT] Sarvam error:', err.response?.data || err.message);
    return next({
      status: err.response?.status || 502,
      message: err.response?.data?.message || 'Speech-to-text failed',
    });
  }
});

module.exports = router;
