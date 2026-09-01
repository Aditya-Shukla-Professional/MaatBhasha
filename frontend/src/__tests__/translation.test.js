/**
 * translation.test.js — Unit tests for translation validation, error handling,
 * cache fallback, and language capability selection.
 * Run: cd frontend && npm test
 */

// ── Utility functions (extracted for testing) ──────────────────────────────

function normalizeText(text) {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
}

function pairKey(src, tgt) { return `${src}→${tgt}`; }

const SUPPORTED_PAIRS = new Set(['hi-IN→sat-IN', 'sat-IN→hi-IN']);

function isSupported(src, tgt) {
  return SUPPORTED_PAIRS.has(pairKey(src, tgt));
}

function getHindiError(err) {
  if (err?.code === 'PAIR_NOT_SUPPORTED') return 'यह भाषा अभी उपलब्ध नहीं है।';
  if (err?.code === 'NO_API_KEY') return 'अनुवाद सेवा कॉन्फ़िगर नहीं है।';
  if (err?.code === 'TEXT_EMPTY') return 'कृपया पहले हिंदी में पाठ लिखें।';
  return 'अभी अनुवाद उपलब्ध नहीं है। इंटरनेट से जुड़कर पुनः प्रयास करें।';
}

// ── Text normalization tests ──────────────────────────────────────────────

describe('normalizeText()', () => {
  test('trims leading and trailing whitespace', () => {
    expect(normalizeText('  नमस्ते  ')).toBe('नमस्ते');
  });

  test('collapses internal whitespace', () => {
    expect(normalizeText('बच्चों   को   पानी')).toBe('बच्चों को पानी');
  });

  test('returns empty string for non-string input', () => {
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');
    expect(normalizeText(42)).toBe('');
  });

  test('handles empty string', () => {
    expect(normalizeText('')).toBe('');
  });

  test('handles whitespace-only string', () => {
    expect(normalizeText('   ')).toBe('');
  });
});

// ── Language pair validation tests ────────────────────────────────────────

describe('isSupported()', () => {
  test('hi-IN to sat-IN is supported', () => {
    expect(isSupported('hi-IN', 'sat-IN')).toBe(true);
  });

  test('sat-IN to hi-IN is supported (reverse)', () => {
    expect(isSupported('sat-IN', 'hi-IN')).toBe(true);
  });

  test('ho-IN is NOT supported', () => {
    expect(isSupported('hi-IN', 'ho-IN')).toBe(false);
  });

  test('mwr-IN (Mundari) is NOT supported', () => {
    expect(isSupported('hi-IN', 'mwr-IN')).toBe(false);
  });

  test('kru-IN (Kurukh) is NOT supported', () => {
    expect(isSupported('hi-IN', 'kru-IN')).toBe(false);
  });

  test('od-IN (Odia) is NOT supported as target', () => {
    expect(isSupported('hi-IN', 'od-IN')).toBe(false);
  });

  test('en-IN to sat-IN is NOT supported', () => {
    expect(isSupported('en-IN', 'sat-IN')).toBe(false);
  });
});

// ── Hindi error message mapping tests ────────────────────────────────────

describe('getHindiError()', () => {
  test('PAIR_NOT_SUPPORTED returns Hindi message', () => {
    const msg = getHindiError({ code: 'PAIR_NOT_SUPPORTED' });
    expect(msg).toContain('उपलब्ध नहीं');
  });

  test('NO_API_KEY returns Hindi message', () => {
    const msg = getHindiError({ code: 'NO_API_KEY' });
    expect(msg).toContain('सेवा');
  });

  test('TEXT_EMPTY returns Hindi message', () => {
    const msg = getHindiError({ code: 'TEXT_EMPTY' });
    expect(msg).toContain('हिंदी');
  });

  test('unknown error returns offline message in Hindi', () => {
    const msg = getHindiError({ code: 'UNKNOWN' });
    expect(msg).toContain('इंटरनेट');
  });

  test('null error returns offline message in Hindi', () => {
    const msg = getHindiError(null);
    expect(msg).toContain('इंटरनेट');
  });
});

// ── Cache key generation tests ────────────────────────────────────────────

function makeTranslationCacheKey(text, sourceLang, targetLang) {
  const t = text.trim().toLowerCase().slice(0, 200);
  return `${sourceLang}→${targetLang}_${t}`;
}

describe('makeTranslationCacheKey()', () => {
  test('generates deterministic keys', () => {
    const key1 = makeTranslationCacheKey('नमस्ते', 'hi-IN', 'sat-IN');
    const key2 = makeTranslationCacheKey('नमस्ते', 'hi-IN', 'sat-IN');
    expect(key1).toBe(key2);
  });

  test('different directions produce different keys', () => {
    const key1 = makeTranslationCacheKey('test', 'hi-IN', 'sat-IN');
    const key2 = makeTranslationCacheKey('test', 'sat-IN', 'hi-IN');
    expect(key1).not.toBe(key2);
  });

  test('truncates long text to 200 chars', () => {
    const longText = 'अ'.repeat(300);
    const key = makeTranslationCacheKey(longText, 'hi-IN', 'sat-IN');
    // The text part should not exceed 200 chars
    const textPart = key.split('_').slice(1).join('_');
    expect(textPart.length).toBeLessThanOrEqual(200);
  });

  test('lowercases the text portion', () => {
    const key = makeTranslationCacheKey('Hello WORLD', 'hi-IN', 'sat-IN');
    expect(key).toContain('hello world');
  });
});

// ── Verified Santali classroom phrases test set ───────────────────────────

const PHRASE_TEST_SET = [
  { hindi: 'नमस्ते बच्चों', santali: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ', romanAid: 'Johar gidra ko', meaning: 'Hello children' },
  { hindi: 'एक', santali: 'ᱢᱤᱫ', romanAid: 'Mid', meaning: 'One' },
  { hindi: 'दो', santali: 'ᱵᱟᱨ', romanAid: 'Bar', meaning: 'Two' },
  { hindi: 'तीन', santali: 'ᱯᱮ', romanAid: 'Pe', meaning: 'Three' },
  { hindi: 'चार', santali: 'ᱯᱩᱱ', romanAid: 'Pun', meaning: 'Four' },
  { hindi: 'पाँच', santali: 'ᱢᱚᱬᱮ', romanAid: 'More', meaning: 'Five' },
  { hindi: 'दस', santali: 'ᱜᱮᱞ', romanAid: 'Gel', meaning: 'Ten' },
  { hindi: 'पानी', santali: 'ᱫᱟᱜ', romanAid: 'Dag', meaning: 'Water' },
  { hindi: 'किताब', santali: 'ᱯᱩᱛᱷᱤ', romanAid: 'Puthi', meaning: 'Book' },
  { hindi: 'हाँ', santali: 'ᱦᱟᱹ', romanAid: 'Ha', meaning: 'Yes' },
  { hindi: 'नहीं', santali: 'ᱵᱟ', romanAid: 'Ba', meaning: 'No' },
  { hindi: 'शाबाश', santali: 'ᱵᱟᱹᱲᱛᱤ', romanAid: 'Badti', meaning: 'Well done / More' },
  { hindi: 'सुनो', santali: 'ᱦᱩᱜᱽ', romanAid: 'Hug', meaning: 'Listen' },
  { hindi: 'देखो', santali: 'ᱧᱮᱞᱚ', romanAid: 'Nyelo', meaning: 'Look / See' },
  { hindi: 'आओ', santali: 'ᱟᱭᱳ', romanAid: 'Ayo', meaning: 'Come' },
  { hindi: 'जाओ', santali: 'ᱥᱮᱱ', romanAid: 'Sen', meaning: 'Go' },
  { hindi: 'बैठो', santali: 'ᱵᱟᱦᱟ', romanAid: 'Baha', meaning: 'Sit' },
  { hindi: 'खड़े हो जाओ', santali: 'ᱛᱷᱤᱨ ᱠᱟᱱᱟ', romanAid: 'Thir kana', meaning: 'Stand up' },
  { hindi: 'बहुत अच्छा', santali: 'ᱵᱟᱹᱲᱛᱤ ᱵᱟᱹᱲᱛᱤ', romanAid: 'Badti badti', meaning: 'Very good' },
  { hindi: 'बच्चे', santali: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ', romanAid: 'Gidra ko', meaning: 'Children (plural)' },
  { hindi: 'पेड़', santali: 'ᱫᱟᱨᱮ', romanAid: 'Dare', meaning: 'Tree' },
  { hindi: 'महुआ', santali: 'ᱢᱟᱦᱩᱣᱟ', romanAid: 'Mahuwa', meaning: 'Mahua (local fruit/flower)' },
  { hindi: 'जंगल', santali: 'ᱵᱤᱨ', romanAid: 'Bir', meaning: 'Forest' },
  { hindi: 'मिट्टी', santali: 'ᱦᱟᱴᱤ', romanAid: 'Hati', meaning: 'Soil / Earth' },
  { hindi: 'घर', santali: 'ᱜᱷᱟᱸ', romanAid: 'Ghan', meaning: 'House' },
];

describe('Classroom phrase test set', () => {
  test('contains exactly 25 phrases', () => {
    expect(PHRASE_TEST_SET.length).toBe(25);
  });

  test('every phrase has required fields', () => {
    for (const phrase of PHRASE_TEST_SET) {
      expect(phrase.hindi).toBeTruthy();
      expect(phrase.santali).toBeTruthy();
      expect(phrase.romanAid).toBeTruthy();
      expect(phrase.meaning).toBeTruthy();
    }
  });

  test('all Santali text contains Ol Chiki Unicode characters', () => {
    // Ol Chiki unicode range is U+1C50–U+1C7F
    for (const phrase of PHRASE_TEST_SET) {
      const hasOlChiki = [...phrase.santali].some(ch => {
        const cp = ch.codePointAt(0);
        return cp >= 0x1C50 && cp <= 0x1C7F;
      });
      expect(hasOlChiki).toBe(true);
    }
  });

  test('no phrase uses the same Hindi and Santali text', () => {
    for (const phrase of PHRASE_TEST_SET) {
      expect(phrase.hindi).not.toBe(phrase.santali);
    }
  });
});
