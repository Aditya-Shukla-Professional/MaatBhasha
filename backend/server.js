require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sttRouter = require('./routes/stt');
const simplifyRouter = require('./routes/simplify');
const translateRouter = require('./routes/translate');
const ttsRouter = require('./routes/tts');
const curriculumRouter = require('./routes/curriculum');
const dialogueRouter = require('./routes/dialogue');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PALASH MaatBhasha API',
    sarvam_key_set: !!process.env.SARVAM_API_KEY &&
      process.env.SARVAM_API_KEY !== 'your_sarvam_api_key_here',
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/stt', sttRouter);
app.use('/api/simplify', simplifyRouter);
app.use('/api/translate', translateRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/curriculum', curriculumRouter);
app.use('/api/dialogue', dialogueRouter);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[MaatBhasha Error]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`\n🌿 MaatBhasha API running on http://localhost:${PORT}`);
  console.log(`   Sarvam key set: ${!!process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY !== 'your_sarvam_api_key_here'}`);
  console.log(`   Health: GET http://localhost:${PORT}/health\n`);
});
