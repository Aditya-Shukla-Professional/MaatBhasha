const express = require('express');
const axios = require('axios');

const router = express.Router();
const SARVAM_BASE = 'https://api.sarvam.ai';

// NIPUN Bharat FLN Competencies Reference
const FLN_FRAMEWORK = {
  'oral_language': { code: 'FLN-L1', title: 'मौखिक भाषा विकास (Oral Language Development)' },
  'phonics_decoding': { code: 'FLN-L2', title: 'ध्वनि एवं डिकोडिंग (Phonics & Decoding)' },
  'reading_comprehension': { code: 'FLN-L3', title: 'पठन एवं समझ (Reading Comprehension)' },
  'numeracy_counting': { code: 'FLN-N1', title: 'संख्या ज्ञान एवं गिनती (Number Sense & Counting)' },
  'basic_operations': { code: 'FLN-N2', title: 'बुनियादी गणितीय संक्रियाएं (Basic Operations)' },
  'shapes_measurement': { code: 'FLN-N3', title: 'आकार एवं मापन (Shapes & Measurement)' },
};

/**
 * POST /api/curriculum/generate
 * Generates NIPUN Bharat FLN lesson scripts, activity instructions, and assessment prompts
 * Body: { topic, gradeLevel, targetLang, moduleType, competency }
 */
router.post('/generate', async (req, res, next) => {
  const { topic, gradeLevel = '1-2', targetLang = 'santali', moduleType = 'full_lesson', competency = 'oral_language' } = req.body;

  if (!topic) {
    return res.status(400).json({ error: '"topic" is required' });
  }

  const compInfo = FLN_FRAMEWORK[competency] || FLN_FRAMEWORK['oral_language'];
  const apiKey = process.env.SARVAM_API_KEY;

  // Prompt design tailored for Jharkhand Tribal Primary Classrooms
  const systemPrompt = `You are a specialist educator for Jharkhand's PALASH Mother Tongue-Based Multilingual Education (MTB-MLE) programme.
Design an FLN (Foundational Literacy and Numeracy) lesson pack for Class ${gradeLevel} aligned with NIPUN Bharat framework (${compInfo.code}: ${compInfo.title}).
Context: Rural tribal primary schools in Jharkhand where teachers are Hindi-medium trained and students speak ${targetLang}.
Generate structured JSON with exact format:
{
  "title": "Topic Title in Hindi",
  "competencyCode": "${compInfo.code}",
  "learningOutcome": "Clear NIPUN Bharat learning outcome statement in Hindi",
  "lessonScript": {
    "teacherHook": "Engaging classroom opening dialogue for teacher in simple Hindi (2-3 sentences)",
    "coreExplanation": "Core concept simplified for Class ${gradeLevel} in Hindi (3-4 bullet points or short sentences)"
  },
  "classroomActivity": {
    "name": "Local tribal culture-aligned game or hands-on activity in Hindi",
    "instructions": "Step-by-step teacher instructions (3 steps)",
    "materialsNeeded": "Easily available village materials (pebbles, leaves, clay, sticks)"
  },
  "assessmentPrompts": [
    "Simple check-for-understanding question 1",
    "Simple check-for-understanding question 2"
  ],
  "keyVocabulary": [
    { "hindi": "Word in Hindi", "english": "English equivalent", "meaning": "Simple child-friendly explanation" }
  ]
}
Return ONLY pure valid JSON without markdown wrapping.`;

  // Mock response if no valid API key
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    return res.json({
      title: `${topic} - FLN पाठ योजना`,
      competencyCode: compInfo.code,
      learningOutcome: `बच्चे ${topic} की बुनियादी समझ और स्थानीय परिवेश से जोड़कर अभिव्यक्ति कर सकेंगे।`,
      lessonScript: {
        teacherHook: `प्यारे बच्चों, आज हम सब मिलकर ${topic} के बारे में जानेंगे! क्या आपने अपने गाँव में इसे देखा है?`,
        coreExplanation: `${topic} हमारे जीवन और प्रकृति का महत्वपूर्ण हिस्सा है। यह हमें ऊर्जा और खुशी देता है। हम सब इसके साथ सीखते हैं।`
      },
      classroomActivity: {
        name: 'गाँव का घेरा और ताली खेल',
        instructions: '1. सभी बच्चे एक घेरे में बैठें। 2. शिक्षक एक शब्द बोलेंगे और बच्चे ताली बजाकर स्थानीय नाम बताएंगे। 3. सही उत्तर पर सब मिलकर जयकार करेंगे।',
        materialsNeeded: 'पत्ते, कंकड़, और मिट्टी की गोलियां'
      },
      assessmentPrompts: [
        `अपने घर या जंगल में ${topic} से जुड़ी कोई एक चीज़ बताएं?`,
        `हम ${topic} का उपयोग कैसे करते हैं?`
      ],
      keyVocabulary: [
        { hindi: 'पेड़', english: 'Tree', meaning: 'बड़ा पौधा जो छाया देता है' },
        { hindi: 'पानी', english: 'Water', meaning: 'पीने और सिंचाई के लिए जरूरी' },
        { hindi: 'सूरज', english: 'Sun', meaning: 'दिन में रोशनी और गर्मी देने वाला' }
      ],
      mock: true
    });
  }

  try {
    const response = await axios.post(
      `${SARVAM_BASE}/v1/chat/completions`,
      {
        model: 'sarvam-105b-conversations',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Topic: ${topic}\nGrade: ${gradeLevel}\nTribal Language Context: ${targetLang}` }
        ],
        temperature: 0.2,
        max_tokens: 1024,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        timeout: 30000,
      }
    );

    const rawContent = response.data.choices?.[0]?.message?.content?.trim() || '';
    let parsedData;
    try {
      // Clean possible code fences if present
      const cleanJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('[Curriculum] Could not parse AI response as JSON, falling back to structured fallback');
      parsedData = {
        title: `${topic} (कक्षा ${gradeLevel})`,
        competencyCode: compInfo.code,
        learningOutcome: `विद्यार्थी ${topic} की बुनियादी अवधारणा को समझ सकेंगे।`,
        lessonScript: {
          teacherHook: `बच्चों, आज हम ${topic} के बारे में बहुत मजेदार बातें सीखेंगे!`,
          coreExplanation: rawContent.slice(0, 300) || `${topic} की बुनियादी समझ।`
        },
        classroomActivity: {
          name: 'स्थानीय खेल गतिविधि',
          instructions: '1. बच्चे कंकड़ों से गिनें। 2. स्थानीय भाषा में नाम दोहराएं। 3. समूह में कार्य करें।',
          materialsNeeded: 'कंकड़, लकड़ी की तीलियां'
        },
        assessmentPrompts: [`${topic} से आपने क्या सीखा?`, 'स्थानीय भाषा में इसका क्या नाम है?'],
        keyVocabulary: [{ hindi: topic, english: topic, meaning: 'मुख्य विषय' }]
      };
    }

    return res.json(parsedData);
  } catch (err) {
    console.error('[Curriculum] Generation error:', err.response?.data || err.message);
    return next({
      status: err.response?.status || 500,
      message: err.response?.data?.message || 'FLN Curriculum generation failed',
    });
  }
});

module.exports = router;
