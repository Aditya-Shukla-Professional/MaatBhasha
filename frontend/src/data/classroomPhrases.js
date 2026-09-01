// classroomPhrases.js — Verified classroom phrases for PALASH MTB-MLE teachers
// Hindi ↔ Santali (Ol Chiki script) with Roman reading aid
//
// sourceStatus legend:
//   'demo-needs-expert-review' — AI-generated / community-sourced draft, NOT validated by a Santali language expert
//   'verified'                 — reviewed and approved by a certified Santali language expert (none yet in this build)
//
// All phrases here are marked 'demo-needs-expert-review' until a Santali language expert validates them.
// Do not present these as authoritative linguistic content in formal assessments.

export const PHRASE_CATEGORIES = [
  { id: 'greetings',    label: 'अभिवादन',       labelEn: 'Greetings' },
  { id: 'attention',    label: 'ध्यान',           labelEn: 'Attention' },
  { id: 'classroom',    label: 'कक्षा क्रियाएं',  labelEn: 'Classroom Actions' },
  { id: 'counting',     label: 'गिनती',           labelEn: 'Counting' },
  { id: 'safety',       label: 'सुरक्षा',          labelEn: 'Safety & Needs' },
  { id: 'praise',       label: 'प्रशंसा',          labelEn: 'Praise' },
  { id: 'assessment',   label: 'मूल्यांकन',        labelEn: 'Assessment' },
];

export const CLASSROOM_PHRASES = [
  // ── GREETINGS (5) ─────────────────────────────────────────────────────────
  {
    id: 'g1',
    category: 'greetings',
    hindi:    'नमस्ते / जोहार बच्चों!',
    santali:  'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ!',
    romanAid: 'Johar gidra ko!',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'g2',
    category: 'greetings',
    hindi:    'सुप्रभात! आज हम कुछ नया सीखेंगे।',
    santali:  'ᱥᱟᱹᱜᱩᱱ! ᱛᱮᱦᱮᱧ ᱢᱤᱫ ᱱᱟᱶᱟ ᱡᱟᱱᱟᱢ ᱠᱟᱛᱮ ᱪᱮᱫᱚᱜ-ᱟ᱾',
    romanAid: 'Sagun! Teheng mid nawa janam kate chedoga.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'g3',
    category: 'greetings',
    hindi:    'क्या सब ठीक हैं?',
    santali:  'ᱦᱚᱲ ᱠᱚ ᱵᱟᱡᱟᱣ ᱠᱟᱱᱟ?',
    romanAid: 'Hor ko bajaw kana?',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'g4',
    category: 'greetings',
    hindi:    'अलविदा बच्चों, कल फिर मिलेंगे।',
    santali:  'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱦᱚᱱᱫᱮ ᱢᱤᱞᱚᱜ-ᱟ᱾',
    romanAid: 'Johar gidra ko, honde milog-a.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'g5',
    category: 'greetings',
    hindi:    'बहुत बढ़िया! आप सभी का स्वागत है।',
    santali:  'ᱵᱟᱹᱲᱛᱤ ᱵᱟᱹᱲᱛᱤ! ᱦᱟᱵᱤ ᱠᱚ ᱥᱟᱹᱜᱩᱱ ᱢᱮᱱᱟᱜ-ᱟ᱾',
    romanAid: 'Badti badti! Habi ko sagun menag-a.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },

  // ── ATTENTION (5) ────────────────────────────────────────────────────────
  {
    id: 'a1',
    category: 'attention',
    hindi:    'ध्यान से सुनो।',
    santali:  'ᱦᱩᱜᱽ ᱜᱤ ᱨᱳᱲ᱾',
    romanAid: 'Hug gi ror.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'a2',
    category: 'attention',
    hindi:    'मेरी तरफ देखो।',
    santali:  'ᱟᱢᱟᱜ ᱢᱮᱛᱟᱜ ᱧᱮᱞᱚ᱾',
    romanAid: 'Amag metag nyelo.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'a3',
    category: 'attention',
    hindi:    'शांत बैठो।',
    santali:  'ᱪᱤᱱ ᱫᱟᱲᱮ ᱵᱟᱦᱟᱭᱟ᱾',
    romanAid: 'Chin dare bahaya.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'a4',
    category: 'attention',
    hindi:    'एक-एक करके बोलो।',
    santali:  'ᱢᱤᱫ ᱢᱤᱫ ᱠᱟᱛᱮ ᱨᱳᱲᱚ᱾',
    romanAid: 'Mid mid kate roro.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'a5',
    category: 'attention',
    hindi:    'हाथ उठाओ अगर जानते हो।',
    santali:  'ᱵᱟᱦᱟ ᱩᱫᱩᱵ ᱠᱟᱛᱮ ᱡᱟᱱᱟᱢᱮᱫ ᱟᱠᱟᱱ᱾',
    romanAid: 'Baha udub kate janamedakana.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },

  // ── CLASSROOM ACTIONS (5) ─────────────────────────────────────────────────
  {
    id: 'c1',
    category: 'classroom',
    hindi:    'किताब खोलो।',
    santali:  'ᱯᱩᱛᱷᱤ ᱠᱷᱳᱞᱚ᱾',
    romanAid: 'Puthi kholo.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'c2',
    category: 'classroom',
    hindi:    'किताब बंद करो।',
    santali:  'ᱯᱩᱛᱷᱤ ᱵᱚᱱᱫ ᱠᱚ᱾',
    romanAid: 'Puthi bond ko.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'c3',
    category: 'classroom',
    hindi:    'पेंसिल उठाओ और लिखो।',
    santali:  'ᱯᱮᱱᱥᱤᱞ ᱩᱫᱩᱵ ᱠᱟᱛᱮ ᱩᱛᱤᱱ᱾',
    romanAid: 'Pensil udub kate utin.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'c4',
    category: 'classroom',
    hindi:    'बाहर जाओ और खेलो।',
    santali:  'ᱵᱟᱦᱨᱮ ᱥᱮᱱ ᱠᱟᱛᱮ ᱠᱷᱮᱞᱚ᱾',
    romanAid: 'Bahre sen kate khelo.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'c5',
    category: 'classroom',
    hindi:    'दोहराओ — मेरे साथ बोलो।',
    santali:  'ᱫᱳᱦᱳᱨᱟᱣ — ᱟᱢ ᱡᱚᱛᱮ ᱨᱳᱲᱚ᱾',
    romanAid: 'Dohoraw — am jote roro.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },

  // ── COUNTING (5) ─────────────────────────────────────────────────────────
  {
    id: 'n1',
    category: 'counting',
    hindi:    'एक से दस तक गिनो।',
    santali:  'ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱞᱮᱠᱷᱟ᱾',
    romanAid: 'Mid khon gel lekha.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'n2',
    category: 'counting',
    hindi:    'पाँच कंकड़ उठाओ।',
    santali:  'ᱢᱚᱬᱮ ᱫᱷᱤᱨᱤ ᱩᱫᱩᱵ᱾',
    romanAid: 'More dhiri udub.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'n3',
    category: 'counting',
    hindi:    'कितने हैं? बताओ।',
    santali:  'ᱮᱱᱟᱦᱚᱱ ᱢᱮᱱᱟᱜ? ᱫᱟᱲᱮ ᱞᱮᱠᱷᱟᱜ᱾',
    romanAid: 'Enahon menag? Dare lekhag.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'n4',
    category: 'counting',
    hindi:    'संथाली में एक को क्या कहते हैं?',
    santali:  'ᱥᱟᱱᱛᱟᱲᱤ ᱨᱮ ᱑ ᱠᱮ ᱢᱤᱫ ᱢᱮᱱᱮᱛ?',
    romanAid: 'Santali re 1 ke mid menet?',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'n5',
    category: 'counting',
    hindi:    'दस पत्ते गिनकर एक बंडल बनाओ।',
    santali:  'ᱜᱮᱞ ᱯᱟᱲᱟ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱢᱤᱫ ᱢᱩᱴᱷᱟᱹ ᱛᱤᱡᱩ᱾',
    romanAid: 'Gel para lekha kate mid mutha tiju.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },

  // ── SAFETY & NEEDS (4) ───────────────────────────────────────────────────
  {
    id: 's1',
    category: 'safety',
    hindi:    'पानी पीना हो तो बताओ।',
    santali:  'ᱫᱟᱜ ᱟᱡᱚᱢ ᱟᱞᱮ ᱫᱚ ᱫᱟᱲᱮ ᱞᱮᱠᱷᱟᱜ᱾',
    romanAid: 'Dag ajom ale do dare lekhag.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 's2',
    category: 'safety',
    hindi:    'बाहर जाना हो तो हाथ उठाओ।',
    santali:  'ᱵᱟᱦᱨᱮ ᱥᱮᱱ ᱟᱞᱮ ᱫᱚ ᱵᱟᱦᱟ ᱩᱫᱩᱵ᱾',
    romanAid: 'Bahre sen ale do baha udub.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 's3',
    category: 'safety',
    hindi:    'सड़क पर सावधान रहना।',
    santali:  'ᱥᱚᱰᱚᱠ ᱨᱮ ᱥᱟᱵᱚᱫᱷᱟᱱ ᱨᱟᱹᱦᱤ᱾',
    romanAid: 'Sodok re sabodhan rahi.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 's4',
    category: 'safety',
    hindi:    'अगर कोई परेशान करे तो मुझे बताओ।',
    santali:  'ᱡᱮᱞᱮ ᱚᱠᱚᱭ ᱰᱷᱟᱡ ᱠᱟᱛᱮ ᱫᱚ ᱟᱢᱟ ᱞᱮᱠᱷᱟᱜ᱾',
    romanAid: 'Jele okoy dhaj kate do ama lekhag.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },

  // ── PRAISE (4) ────────────────────────────────────────────────────────────
  {
    id: 'p1',
    category: 'praise',
    hindi:    'शाबाश! बहुत अच्छा किया।',
    santali:  'ᱵᱟᱹᱲᱛᱤ! ᱵᱟᱲᱟᱭ ᱠᱟᱛᱮᱡ ᱠᱟᱱᱟ᱾',
    romanAid: 'Badti! Baray katej kana.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'p2',
    category: 'praise',
    hindi:    'आप बहुत होशियार हो।',
    santali:  'ᱟᱢ ᱵᱟᱹᱲᱛᱤ ᱫᱟᱹᱧᱲᱟᱹᱧ ᱮᱢᱟᱭᱮ᱾',
    romanAid: 'Am badti daynrany emaye.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'p3',
    category: 'praise',
    hindi:    'यह सही उत्तर है।',
    santali:  'ᱱᱤᱡ ᱫᱚ ᱵᱟᱰᱟᱭ ᱵᱟᱛᱟᱣ ᱢᱮᱱᱟᱜ-ᱟ᱾',
    romanAid: 'Nij do baday bataw menag-a.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'p4',
    category: 'praise',
    hindi:    'कोशिश करते रहो।',
    santali:  'ᱡᱚᱛᱮᱫ ᱫᱚ ᱟᱲᱟᱧ ᱮᱛᱚᱜ᱾',
    romanAid: 'Joted do arang etog.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },

  // ── ASSESSMENT (2) ────────────────────────────────────────────────────────
  {
    id: 'q1',
    category: 'assessment',
    hindi:    'क्या आपको समझ आया?',
    santali:  'ᱟᱢᱠᱮ ᱥᱟᱶ ᱵᱩᱡᱷᱟᱹᱣ ᱮᱢᱟᱭᱮᱫᱟ?',
    romanAid: 'Amke saw bujhaw emayeda?',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
  {
    id: 'q2',
    category: 'assessment',
    hindi:    'एक बार और बताओ।',
    santali:  'ᱢᱤᱫ ᱠᱷᱮᱯᱚᱨ ᱫᱟᱲᱮ ᱞᱮᱠᱷᱟᱜ᱾',
    romanAid: 'Mid khepor dare lekhag.',
    sourceStatus: 'demo-needs-expert-review',
    hasAudio: false,
  },
];

export const PHRASE_SOURCE_NOTE =
  'ये वाक्यांश AI-सहायता से तैयार किए गए हैं और किसी संताली भाषा विशेषज्ञ द्वारा अभी तक सत्यापित नहीं हुए हैं। ' +
  'इन्हें केवल प्रोटोटाइप डेमो के लिए उपयोग करें।';
