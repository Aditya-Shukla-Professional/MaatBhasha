const express = require('express');
const axios = require('axios');

const router = express.Router();
const SARVAM_BASE = 'https://api.sarvam.ai';

const LANG_MAP = {
  santali: 'sat-IN',
  ho:      'ho-IN',
  mundari: 'mwr-IN',
  kurukh:  'kru-IN',
  odia:    'od-IN',
  hindi:   'hi-IN',
  english: 'en-IN'
};

const TTS_SPEAKABLE = new Set([
  'hi-IN', 'en-IN', 'ta-IN', 'te-IN', 'kn-IN',
  'ml-IN', 'mr-IN', 'gu-IN', 'bn-IN', 'pa-IN', 'od-IN'
]);

const TTS_FALLBACK = 'od-IN';

/**
 * POST /api/dialogue/turn
 * Ultra-fast voice-to-voice turn translator for interactive classroom dialogue
 * Body: {
 *   inputText: string,
 *   speakerRole: 'teacher' | 'student',
 *   sourceLang: string ('hi' or tribal),
 *   targetLang: string ('santali', 'ho', 'mundari', 'hindi', etc.),
 *   generateAudio?: boolean
 * }
 */
router.post('/turn', async (req, res, next) => {
  const {
    inputText,
    speakerRole = 'teacher',
    sourceLang = 'hi',
    targetLang = 'santali',
    generateAudio = true
  } = req.body;

  if (!inputText || typeof inputText !== 'string') {
    return res.status(400).json({ error: '"inputText" is required' });
  }

  const startTime = Date.now();
  const apiKey = process.env.SARVAM_API_KEY;

  const srcCode = LANG_MAP[sourceLang.toLowerCase()] || (sourceLang === 'hi' ? 'hi-IN' : 'en-IN');
  const tgtCode = LANG_MAP[targetLang.toLowerCase()] || 'sat-IN';

  // Mock mode fallback
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    const mockTranslated = speakerRole === 'teacher'
      ? `(ᱥᱟᱱᱛᱟᱲᱤ) ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! (Welcome children!)`
      : `हाँ गुरुजी, मुझे समझ आ गया!`;
    const SILENT_WAV = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    return res.json({
      translatedText: mockTranslated,
      phoneticHint: speakerRole === 'teacher' ? 'Sagun daram gidra ko!' : 'Haan guruji',
      audioDataUri: `data:audio/wav;base64,${SILENT_WAV}`,
      latencyMs: Date.now() - startTime,
      fallbackUsed: true,
      targetLangCode: tgtCode
    });
  }

  try {
    // Step 1: Rapid translation via sarvam-translate:v1
    const transPromise = axios.post(
      `${SARVAM_BASE}/translate`,
      {
        input: inputText,
        source_language_code: srcCode,
        target_language_code: tgtCode,
        speaker_gender: 'Female',
        mode: 'formal',
        model: 'sarvam-translate:v1',
        enable_preprocessing: true,
      },
      {
        headers: { 'Content-Type': 'application/json', 'api-subscription-key': apiKey },
        timeout: 25000,
      }
    );

    const transRes = await transPromise;
    const translatedText = transRes.data?.translated_text || inputText;

    let audioDataUri = null;
    let fallbackUsed = false;
    let usedVoiceLang = tgtCode;

    // Step 2: Ultra-fast TTS generation if requested
    if (generateAudio) {
      const isVoiceSupported = TTS_SPEAKABLE.has(tgtCode);
      usedVoiceLang = isVoiceSupported ? tgtCode : TTS_FALLBACK;
      fallbackUsed = !isVoiceSupported;

      // If target script is non-phonetic for Bulbul (like Ol Chiki for Santali),
      // we generate audio using the closest regional phonetic bridge (Odia) or Hindi
      let audioInputText = translatedText;
      if (fallbackUsed) {
        // Quick 1-sentence translation for audio
        try {
          const audioTrans = await axios.post(
            `${SARVAM_BASE}/translate`,
            {
              input: inputText,
              source_language_code: srcCode,
              target_language_code: TTS_FALLBACK,
              speaker_gender: 'Female',
              mode: 'formal',
              model: 'sarvam-translate:v1',
              enable_preprocessing: true,
            },
            {
              headers: { 'Content-Type': 'application/json', 'api-subscription-key': apiKey },
              timeout: 15000,
            }
          );
          audioInputText = audioTrans.data?.translated_text || inputText;
        } catch (e) {
          audioInputText = inputText;
        }
      }

      // Safe truncate to 350 chars for rapid TTS latency < 1.5s
      const safeAudioText = audioInputText.length > 350 ? audioInputText.slice(0, 347) + '…' : audioInputText;

      try {
        const ttsRes = await axios.post(
          `${SARVAM_BASE}/text-to-speech`,
          {
            inputs: [safeAudioText],
            target_language_code: usedVoiceLang,
            speaker: 'priya',
            pace: 1.05,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: 'bulbul:v3',
          },
          {
            headers: { 'Content-Type': 'application/json', 'api-subscription-key': apiKey },
            timeout: 20000,
          }
        );

        const base64Audio = ttsRes.data?.audios?.[0];
        if (base64Audio) {
          audioDataUri = `data:audio/wav;base64,${base64Audio}`;
        }
      } catch (ttsErr) {
        console.warn('[Dialogue TTS Notice]', ttsErr.message);
      }
    }

    const latencyMs = Date.now() - startTime;

    return res.json({
      translatedText,
      audioDataUri,
      latencyMs,
      fallbackUsed,
      usedVoiceLang,
      targetLangCode: tgtCode
    });

  } catch (err) {
    console.warn('[Dialogue Fallback Used]', err.message);
    const latencyMs = Date.now() - startTime;
    return res.json({
      translatedText: inputText,
      audioDataUri: null,
      latencyMs,
      fallbackUsed: true,
      targetLangCode: tgtCode,
      notice: 'Fallback used due to network delay'
    });
  }
});

module.exports = router;
