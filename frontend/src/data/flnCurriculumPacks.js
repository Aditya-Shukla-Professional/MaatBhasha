// flnCurriculumPacks.js — Pre-built NIPUN Bharat FLN Curriculum Packs for Jharkhand MTB-MLE
// Primary language focus: Santali (Ol Chiki).
// Content status: 'demo' (AI-generated / drafted — requires certified Santali language expert validation)

export const FLN_PACKS = [
  // ── PACK 1: Numeracy 1-10 ──────────────────────────────────────────────────
  {
    id: 'fln-num-1',
    contentStatus: 'demo',
    title: 'संख्या बोध (१ से १० गिनती एवं बंडलिंग)',
    competencyCode: 'FLN-N1.1',
    competencyTitle: 'संख्या ज्ञान एवं ठोस वस्तुओं से गिनती (Counting with concrete objects)',
    gradeLevel: '1-2',
    subject: 'Numeracy (गणित)',
    theme: 'गिनती और कंकड़ (Pebbles & Counting)',
    lessonScript: {
      teacherHook: 'बच्चों, आज हम पेड़ों से गिरे महुआ के फल और कंकड़ गिनना सीखेंगे! क्या आपके पास कंकड़ हैं?',
      coreExplanation: 'एक कंकड़ मतलब एक (१)। दो कंकड़ मतलब दो (२)। जब दस कंकड़ मिल जाते हैं, तो एक बंडल बन जाता है!',
      stepByStep: [
        '१ (एक) — १ पत्ता / ᱢᱤᱫ ᱥᱟᱠᱟᱢ',
        '२ (दो) — २ कंकड़ / ᱵᱟᱨ ᱫᱷᱤᱨᱤ',
        '३ (तीन) — ३ बीज / ᱯᱮ ᱡᱟᱝ',
        '४ (चार) — ४ तीलियाँ / ᱯᱩᱱ ᱥᱤᱝᱜᱟᱹ',
        '५ (पाँच) — १ हाथ की उँगलियाँ / ᱢᱚᱬᱮ ᱛᱤ ᱠᱟᱹᱴᱩᱵ',
        '१० (दस) — १ पूरा बंडल / ᱜᱮᱞ ᱢᱤᱫ ᱢᱩᱴᱷᱟᱹ'
      ]
    },
    classroomActivity: {
      name: 'महुआ बीनने का खेल (The Mahua Gathering Game)',
      instructions: 'बच्चे जमीन पर घेरा बनाकर बैठेंगे। शिक्षक बोलेंगे "तीन महुआ", बच्चे तीन-तीन कंकड़ उठाएंगे और संताली में "ᱯᱮ (Pey)" बोलेंगे।',
      materialsNeeded: 'कंकड़, सूखे बीज, इमली के बीज'
    },
    assessmentPrompts: [
      'अपने हाथ में ४ कंकड़ उठाकर दिखाओ और संताली में बोलो।',
      'यदि ३ कंकड़ में २ कंकड़ और जोड़ें, तो संताली में क्या कहेंगे?'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱮᱞ ᱩᱯᱨᱩᱢ (᱑ ᱠᱷᱚᱱ ᱑᱐ ᱞᱮᱠᱷᱟ)',
        teacherHook: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱛᱮᱦᱮᱧ ᱫᱚ ᱢᱟᱦᱩᱣᱟ ᱡᱚ ᱟᱨ ᱫᱷᱤᱨᱤ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ!',
        coreExplanation: 'ᱢᱤᱫᱴᱟᱝ ᱫᱷᱤᱨᱤ ᱢᱮᱱᱮᱛ ᱑। ᱵᱟᱨᱭᱟ ᱫᱷᱤᱨᱤ ᱢᱮᱱᱮᱛ ᱒। ᱜᱮᱞ (᱑᱐) ᱫᱷᱤᱨᱤ ᱢᱤᱞᱟᱹᱣ ᱠᱟᱛᱮ ᱢᱤᱫ ᱢᱩᱴᱷᱟᱹ ᱵᱮᱱᱟᱜ-ᱟ!',
        vocabulary: [
          { hi: 'एक', tribal: 'ᱢᱤᱫ', romanAid: 'Mid', en: 'One' },
          { hi: 'दो', tribal: 'ᱵᱟᱨ', romanAid: 'Bar', en: 'Two' },
          { hi: 'तीन', tribal: 'ᱯᱮ', romanAid: 'Pey', en: 'Three' },
          { hi: 'चार', tribal: 'ᱯᱩᱱ', romanAid: 'Pun', en: 'Four' },
          { hi: 'पाँच', tribal: 'ᱢᱚᱬᱮ', romanAid: 'More', en: 'Five' },
          { hi: 'छह', tribal: 'ᱛᱩᱨᱩᱭ', romanAid: 'Turuy', en: 'Six' },
          { hi: 'सात', tribal: 'ᱮᱭᱟᱭ', romanAid: 'Eyay', en: 'Seven' },
          { hi: 'आठ', tribal: 'ᱤᱨᱟᱹᱞ', romanAid: 'Iral', en: 'Eight' },
          { hi: 'नौ', tribal: 'ᱟᱨᱮ', romanAid: 'Are', en: 'Nine' },
          { hi: 'दस', tribal: 'ᱜᱮᱞ', romanAid: 'Gel', en: 'Ten' }
        ]
      }
    }
  },

  // ── PACK 2: Daily Classroom Dialogue ──────────────────────────────────────
  {
    id: 'fln-daily-1',
    contentStatus: 'demo',
    title: 'दैनिक कक्षा संवाद एवं शिष्टाचार',
    competencyCode: 'FLN-L2.1',
    competencyTitle: 'कक्षा संप्रेषण एवं दो-तरफ़ा संवाद (Two-way Classroom Communication)',
    gradeLevel: '1-3',
    subject: 'Classroom Life (कक्षा संवाद)',
    theme: 'कक्षा में रोज़ाना बातचीत (Daily Classroom Routines)',
    lessonScript: {
      teacherHook: 'शिक्षक बच्चों का स्वागत करेंगे और उनकी संताली भाषा में "जोहार" बोलकर हालचाल पूछेंगे।',
      coreExplanation: 'जब हम कक्षा में आते हैं, तो सब मिलकर जोहार बोलते हैं। पानी पीने या बाहर जाने के लिए विनम्रता से पूछते हैं।',
      stepByStep: [
        'नमस्ते / जोहार — ᱡᱚᱦᱟᱨ (Johar)',
        'आप कैसे हैं? — ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ? (Chet leka menama?)',
        'मैं ठीक हूँ — ᱱᱟᱯᱟᱭ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ (Napay ge menanya)',
        'बैठ जाओ — ᱫᱩᱲᱩᱵ ᱯᱮ (Durup pe)',
        'किताब खोलो — ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱯᱮ (Puthi jhij pe)',
        'पानी पीना है — ᱫᱟᱜ ᱧᱩ ᱥᱟᱱᱟᱭᱤᱧ ᱠᱟᱱᱟ (Daag nyu sanany kana)'
      ]
    },
    classroomActivity: {
      name: 'जोहार और मित्रता चक्र (Johar Greeting Circle)',
      instructions: 'दो-दो बच्चे आमने-सामने खड़े होंगे और संताली में एक-दूसरे का अभिवादन "ᱡᱚᱦᱟᱨ" और "ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ" कहकर करेंगे।',
      materialsNeeded: 'कोई नहीं'
    },
    assessmentPrompts: [
      'कक्षा में शिक्षक का अभिवादन संताली में कैसे करोगे?',
      'यदि आपको प्यास लगे तो संताली में क्या कहोगे?'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱫᱤᱱᱟᱹᱢ ᱠᱞᱟᱥ ᱨᱚᱯᱚᱲ (Daily Classroom Dialogue)',
        teacherHook: 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱡᱚᱛᱚ ᱦᱚᱲ ᱱᱟᱯᱟᱭ ᱜᱮ ᱢᱮᱱᱟᱜ ᱯᱮᱭᱟ ᱛᱚ?',
        coreExplanation: 'ᱠᱞᱟᱥ ᱨᱮ ᱵᱚᱞᱚ ᱠᱟᱛᱮ ᱡᱚᱦᱟᱨ ᱢᱮᱱ ᱦᱩᱭᱩᱜ-ᱟ।',
        vocabulary: [
          { hi: 'नमस्ते / प्रणाम', tribal: 'ᱡᱚᱦᱟᱨ', romanAid: 'Johar', en: 'Greetings / Hello' },
          { hi: 'आप कैसे हैं?', tribal: 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?', romanAid: 'Chet leka menama?', en: 'How are you?' },
          { hi: 'मैं ठीक हूँ', tribal: 'ᱱᱟᱯᱟᱭ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ', romanAid: 'Napay ge menanya', en: 'I am fine' },
          { hi: 'बैठ जाओ', tribal: 'ᱫᱩᱲᱩᱵ ᱯᱮ', romanAid: 'Durup pe', en: 'Sit down' },
          { hi: 'किताब खोलो', tribal: 'ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱯᱮ', romanAid: 'Puthi jhij pe', en: 'Open book' },
          { hi: 'पानी पीना है', tribal: 'ᱫᱟᱜ ᱧᱩ ᱥᱟᱱᱟᱭᱤᱧ ᱠᱟᱱᱟ', romanAid: 'Daag nyu sanany kana', en: 'Want water' }
        ]
      }
    }
  },

  // ── PACK 3: Literacy - Sounds & Letters ────────────────────────────────────
  {
    id: 'fln-lit-1',
    contentStatus: 'demo',
    title: 'ध्वनि पहचान एवं Ol Chiki वर्णमाला परिचय',
    competencyCode: 'FLN-L1.2',
    competencyTitle: 'आरंभिक ध्वनि पहचान एवं अक्षर ज्ञान (Phonemic Awareness)',
    gradeLevel: '1',
    subject: 'Literacy (भाषा व साक्षरता)',
    theme: 'ध्वनि और अक्षर (Sounds & Letters)',
    lessonScript: {
      teacherHook: 'आओ बच्चों! हवा, पानी और पक्षियों की आवाज़ सुनें और उन्हें Ol Chiki लिपि के अक्षरों से जोड़ें।',
      coreExplanation: 'हर शब्द एक ध्वनि से शुरू होता है। जैसे "ᱫᱟᱜ" (पानी) "ᱫ" से शुरू होता है और "ᱫᱟᱨᱮ" (पेड़) भी "ᱫ" से।',
      stepByStep: [
        'ᱚ (La) — पहला स्वर वर्ण',
        'ᱛ (At) — आग की आवाज़ जैसा',
        'ᱜ (Ag) — गूँजती आवाज़',
        'ᱝ (Ang) — नासिका ध्वनि',
        'ᱞ (Al) — लिखने का प्रतीक'
      ]
    },
    classroomActivity: {
      name: 'ध्वनि खोज खेल (Sound Detective Game)',
      instructions: 'शिक्षक एक ध्वनि बोलेंगे (जैसे "ᱫ"), बच्चों को कक्षा में या प्रकृति में उस ध्वनि से शुरू होने वाली वस्तु का नाम बताना है।',
      materialsNeeded: 'चित्र कार्ड, चाक, स्लेट'
    },
    assessmentPrompts: [
      '"ᱫᱟᱨᱮ" (पेड़) शब्द की पहली ध्वनि कौन सी है?',
      'Ol Chiki में "ᱚ" अक्षर को हवा में लिखकर दिखाओ।'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱟᱲᱟᱝ ᱩᱯᱨᱩᱢ ᱟᱨ ᱚᱞ ᱪᱤᱠᱤ ᱮᱛᱚᱦᱚᱵ',
        teacherHook: 'ᱦᱮᱡ ᱞᱮᱱ ᱯᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱟᱵᱚ ᱫᱚ ᱚᱞ ᱪᱤᱠᱤ ᱟᱲᱟᱝ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ!',
        coreExplanation: 'ᱡᱚᱛᱚ ᱟᱹᱲᱟᱹ ᱨᱮᱭᱟᱜ ᱢᱤᱫ ᱮᱛᱚᱦᱚᱵ ᱟᱲᱟᱝ ᱛᱟᱦᱮᱸᱱᱟ।',
        vocabulary: [
          { hi: 'अक्षर', tribal: 'ᱪᱤᱠᱤ', romanAid: 'Chiki', en: 'Letter / Script' },
          { hi: 'ध्वनि / आवाज़', tribal: 'ᱟᱲᱟᱝ', romanAid: 'Arang', en: 'Sound / Voice' },
          { hi: 'शब्द', tribal: 'ᱟᱹᱲᱟᱹ', romanAid: 'Ara', en: 'Word' },
          { hi: 'लिखना', tribal: 'ᱚᱞ', romanAid: 'Ol', en: 'To write' },
          { hi: 'पढ़ना', tribal: 'ᱯᱟᱲᱦᱟᱣ', romanAid: 'Parhaw', en: 'To read' }
        ]
      }
    }
  },

  // ── PACK 4: Environment - Trees, Forests, Sarhul ───────────────────────────
  {
    id: 'fln-env-1',
    contentStatus: 'demo',
    title: 'हमारे पेड़-पौधे, जंगल एवं सरहुल पर्व',
    competencyCode: 'FLN-E1.1',
    competencyTitle: 'पर्यावरण बोध एवं स्थानीय प्रकृति परिचय (Environmental Awareness)',
    gradeLevel: '1-3',
    subject: 'EVS (पर्यावरण अध्ययन)',
    theme: 'प्रकृति और परंपरा (Nature & Heritage)',
    lessonScript: {
      teacherHook: 'हमारे गाँव के पास का जंगल कितना हरा-भरा है! साल के फूल खिलने पर हम कौन सा त्योहार मनाते हैं?',
      coreExplanation: 'पेड़ (ᱫᱟᱨᱮ) हमें छाया, हवा और फल देते हैं। सरहुल में हम साल (ᱥᱟᱨᱡᱚᱢ) के फूलों की पूजा करते हैं।',
      stepByStep: [
        'पेड़ — ᱫᱟᱨᱮ (Dare)',
        'जंगल — ᱵᱤᱨ (Bir)',
        'साल वृक्ष — ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ (Sarjom dare)',
        'महुआ — ᱢᱟᱦᱩᱣᱟ (Mahuwa)',
        'फूल — ᱵᱟᱦᱟ (Baha)',
        'पत्ता — ᱥᱟᱠᱟᱢ (Sakam)'
      ]
    },
    classroomActivity: {
      name: 'पत्ते पहचानो और माला बनाओ (Leaf Matching & Garland Activity)',
      instructions: 'बच्चे स्कूल प्रांगण से अलग-अलग पत्ते चुनकर लाएंगे और संताली में उनके नाम बताएंगे।',
      materialsNeeded: 'साल, महुआ व नीम के पत्ते, धागा'
    },
    assessmentPrompts: [
      'साल के पेड़ को संताली में क्या कहते हैं?',
      'सरहुल पर्व में किस फूल का उपयोग किया जाता है?'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱟᱵᱚᱣᱟᱜ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ, ᱵᱤᱨ ᱟᱨ ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ',
        teacherHook: 'ᱟᱵᱚᱣᱟᱜ ᱟᱹᱛᱩ ᱵᱤᱨ ᱛᱤᱱᱟᱹᱜ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱜᱮᱭᱟ! ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ ᱡᱚᱠᱷᱚᱱ ᱵᱟᱦᱟᱜ-ᱟ ᱩᱱᱡᱚᱠᱷᱚᱱ ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ ᱵᱚᱱ ᱢᱟᱱᱟᱣᱟ!',
        coreExplanation: 'ᱫᱟᱨᱮ ᱫᱚ ᱟᱵᱚ ᱦᱚᱭ, ᱩᱢᱩᱞ ᱟᱨ ᱡᱚ ᱮᱢᱟᱵᱚᱱᱟ।',
        vocabulary: [
          { hi: 'पेड़', tribal: 'ᱫᱟᱨᱮ', romanAid: 'Dare', en: 'Tree' },
          { hi: 'जंगल', tribal: 'ᱵᱤᱨ', romanAid: 'Bir', en: 'Forest' },
          { hi: 'फूल', tribal: 'ᱵᱟᱦᱟ', romanAid: 'Baha', en: 'Flower' },
          { hi: 'पत्ता', tribal: 'ᱥᱟᱠᱟᱢ', romanAid: 'Sakam', en: 'Leaf' },
          { hi: 'साल का पेड़', tribal: 'ᱥᱟᱨᱡᱚᱢ', romanAid: 'Sarjom', en: 'Sal Tree' },
          { hi: 'मिट्टी', tribal: 'ᱦᱟᱥᱟ', romanAid: 'Hasa', en: 'Soil / Earth' }
        ]
      }
    }
  },

  // ── PACK 5: Body Parts & Hygiene ──────────────────────────────────────────
  {
    id: 'fln-body-1',
    contentStatus: 'demo',
    title: 'हमारे शरीर के अंग एवं स्वच्छता की आदतें',
    competencyCode: 'FLN-H1.1',
    competencyTitle: 'स्वास्थ्य, स्वच्छता एवं आत्म-परिचय (Health & Body Awareness)',
    gradeLevel: '1-2',
    subject: 'Health & EVS (स्वास्थ्य व स्वच्छता)',
    theme: 'शरीर और सफाई (Body & Cleanliness)',
    lessonScript: {
      teacherHook: 'आओ बच्चों! अपने हाथ ऊपर करो और ताली बजाओ। क्या आप अपने शरीर के अंगों के संताली नाम जानते हो?',
      coreExplanation: 'हम आँख (ᱢᱮᱫ) से देखते हैं, कान (ᱞᱩᱛᱩᱨ) से सुनते हैं और हाथ (ᱛᱤ) से खाना खाते व लिखते हैं। खाना खाने से पहले हाथ धोना चाहिए।',
      stepByStep: [
        'सिर — ᱵᱚᱦᱚᱜ (Bohog)',
        'आँख — ᱢᱮᱫ (Med)',
        'नाक — ᱢᱩ (Mu)',
        'कान — ᱞᱩᱛᱩᱨ (Lutur)',
        'हाथ — ᱛᱤ (Ti)',
        'पैर — ᱡᱟᱝᱜᱟ (Janga)'
      ]
    },
    classroomActivity: {
      name: 'अंग छुओ खेल (Touch Your Body Part Song)',
      instructions: 'शिक्षक संताली में बोलेंगे "ᱛᱤ ᱩᱫᱩᱜ ᱢᱮ" (हाथ दिखाओ), बच्चे हाथ ऊपर करेंगे। जो गलत अंग छुएगा वह ताली बजाएगा।',
      materialsNeeded: 'कोई नहीं'
    },
    assessmentPrompts: [
      'अपनी आँख को संताली में क्या कहते हैं?',
      'खाना खाने से पहले क्या धोना चाहिए?'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱟᱵᱚᱣᱟᱜ ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ ᱟᱨ ᱥᱟᱯᱷᱟ-ᱥᱟᱹᱯᱷᱤ',
        teacherHook: 'ᱦᱮᱡ ᱞᱮᱱ ᱯᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱟᱯᱱᱟᱨ ᱛᱤ ᱛᱩᱞ ᱠᱟᱛᱮ ᱪᱟᱯᱲᱤ ᱛᱷᱟᱭᱚ ᱢᱮ!',
        coreExplanation: 'ᱢᱮᱫ ᱛᱮ ᱵᱚᱱ ᱧᱮᱞᱟ, ᱞᱩᱛᱩᱨ ᱛᱮ ᱵᱚᱱ ᱟᱸᱡᱚᱢᱟ ᱟᱨ ᱛᱤ ᱛᱮ ᱵᱚᱱ ᱚᱞᱟ।',
        vocabulary: [
          { hi: 'सिर', tribal: 'ᱵᱚᱦᱚᱜ', romanAid: 'Bohog', en: 'Head' },
          { hi: 'आँख', tribal: 'ᱢᱮᱫ', romanAid: 'Med', en: 'Eye' },
          { hi: 'नाक', tribal: 'ᱢᱩ', romanAid: 'Mu', en: 'Nose' },
          { hi: 'कान', tribal: 'ᱞᱩᱛᱩᱨ', romanAid: 'Lutur', en: 'Ear' },
          { hi: 'हाथ', tribal: 'ᱛᱤ', romanAid: 'Ti', en: 'Hand' },
          { hi: 'पैर', tribal: 'ᱡᱟᱝᱜᱟ', romanAid: 'Janga', en: 'Leg / Foot' }
        ]
      }
    }
  },

  // ── PACK 6: Basic Addition & Subtraction ───────────────────────────────────
  {
    id: 'fln-math-2',
    contentStatus: 'demo',
    title: 'जोड़ और घटाव की प्रारंभिक समझ (वस्तुओं के साथ)',
    competencyCode: 'FLN-N2.1',
    competencyTitle: 'मूर्त वस्तुओं के साथ जोड़ व घटाव (Concrete Addition & Subtraction)',
    gradeLevel: '2-3',
    subject: 'Numeracy (गणित)',
    theme: 'जोड़ना और घटाना (Addition & Subtraction)',
    lessonScript: {
      teacherHook: 'सोचो! आपके पास ३ महुआ हैं और दोस्त ने २ महुआ और दिए। अब कितने महुआ हुए?',
      coreExplanation: 'जोड़ने (ᱢᱮᱥᱟ) का मतलब है और मिलाना। घटाने (ᱚᱪᱚᱜ) का मतलब है कुछ निकाल लेना।',
      stepByStep: [
        '३ + २ = ५ (ᱯᱮ + ᱵᱟᱨ = ᱢᱚᱬᱮ)',
        '४ + १ = ५ (ᱯᱩᱱ + ᱢᱤᱫ = ᱢᱚᱬᱮ)',
        '५ - २ = ३ (ᱢᱚᱬᱮ - ᱵᱟᱨ = ᱯᱮ)',
        '१० - ५ = ५ (ᱜᱮᱞ - ᱢᱚᱬᱮ = ᱢᱚᱬᱮ)'
      ]
    },
    classroomActivity: {
      name: 'टोकरी में फल भरो (Fill the Fruit Basket)',
      instructions: 'दो समूह बनेंगे। एक समूह बीज डालेगा (जोड़), दूसरा समूह कुछ बीज निकालेगा (घटाव)। कुल संख्या संताली में बतानी होगी।',
      materialsNeeded: 'इमली के बीज, छोटी टोकरी या कागज़ की प्लेट'
    },
    assessmentPrompts: [
      'यदि आपके पास ᱵᱟᱨ (२) अमरूद हैं और २ और मिले, तो कुल कितने होंगे?',
      'ᱢᱚᱬᱮ (५) में से ᱢᱤᱫ (१) कम करने पर क्या बचेगा?'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱢᱮᱥᱟ ᱟᱨ ᱚᱪᱚᱜ (ᱡᱚᱲᱟᱣ ᱟᱨ ᱵᱷᱮᱜᱟᱨ)',
        teacherHook: 'ᱩᱭᱦᱟᱹᱨ ᱢᱮ! ᱟᱢ ᱴᱷᱮᱱ ᱯᱮᱭᱟ (᱓) ᱡᱚ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱟᱨ ᱜᱟᱛᱮ ᱵᱟᱨᱭᱟ (᱒) ᱮᱢᱟᱫ ᱢᱮᱭᱟ। ᱱᱤᱛᱚᱜ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭᱮᱱᱟ?',
        coreExplanation: 'ᱢᱮᱥᱟ ᱢᱮᱱᱮᱛ ᱡᱚᱲᱟᱣ, ᱚᱪᱚᱜ ᱢᱮᱱᱮᱛ ᱠᱚᱢ ᱜᱤᱰᱤ।',
        vocabulary: [
          { hi: 'जोड़ना / मिलाना', tribal: 'ᱢᱮᱥᱟ', romanAid: 'Mesa', en: 'Add / Mix' },
          { hi: 'घटाना / निकालना', tribal: 'ᱚᱪᱚᱜ', romanAid: 'Ochog', en: 'Subtract / Remove' },
          { hi: 'कुल / सब', tribal: 'ᱡᱚᱛᱚ', romanAid: 'Joto', en: 'All / Total' },
          { hi: 'बराबर', tribal: 'ᱥᱚᱢᱟᱱ', romanAid: 'Soman', en: 'Equal' },
          { hi: 'ज्यादा', tribal: 'ᱵᱟᱹᱲᱛᱤ', romanAid: 'Badti', en: 'More' },
          { hi: 'कम', tribal: 'ᱠᱚᱢ', romanAid: 'Kom', en: 'Less' }
        ]
      }
    }
  },

  // ── PACK 7: Cultural Festivals - Karam & Sohrai ────────────────────────────
  {
    id: 'fln-fest-1',
    contentStatus: 'demo',
    title: 'करम और सोहराय पर्व (सांस्कृतिक परंपरा एवं गीत)',
    competencyCode: 'FLN-C1.1',
    competencyTitle: 'सांस्कृतिक चेतना एवं मौखिक परंपरा (Cultural & Oral Heritage)',
    gradeLevel: '1-3',
    subject: 'Culture & Arts (संस्कृति व कला)',
    theme: 'पर्व और लोकगीत (Festivals & Folk Songs)',
    lessonScript: {
      teacherHook: 'सोहराय में हम अपने बैलों और गायों को कैसे सजाते हैं? दीवारों पर सोहराई पेंटिंग कौन बनाता है?',
      coreExplanation: 'सोहराय (ᱥᱚᱦᱨᱟᱭ) फसल कटने पर मनाया जाता है और करम (ᱠᱟᱨᱟᱢ) भाई-बहन के प्रेम व प्रकृति की रक्षा का पर्व है।',
      stepByStep: [
        'सोहराय पर्व — ᱥᱚᱦᱨᱟᱭ ᱯᱚᱨᱚᱵᱽ (Sohray Porob)',
        'करम पर्व — ᱠᱟᱨᱟᱢ ᱯᱚᱨᱚᱵᱽ (Karam Porob)',
        'ढोल / मांदर — ᱛᱩᱢᱫᱟᱜ (Tumdak)',
        'बांसुरी — ᱛᱤᱨᱤᱭᱚ (Tiriyo)',
        'नाच — ᱮᱱᱮᱡ (Enej)',
        'गाना — ᱥᱮᱨᱮᱧ (Serenj)'
      ]
    },
    classroomActivity: {
      name: 'सोहराई दीवार चित्रकारी (Sohrai Wall Motif Sketching)',
      instructions: 'बच्चे स्लेट या कागज़ पर सोहराई शैली में मोर, मछली और पेड़ के पारंपरिक रेखाचित्र बनाएंगे।',
      materialsNeeded: 'चाक, रंगीन पेंसिलें, ड्राइंग शीट'
    },
    assessmentPrompts: [
      'संताली पारंपरिक मांदर को क्या कहते हैं?',
      'सोहराय पर्व में किसकी पूजा और सजावट की जाती है?'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱠᱟᱨᱟᱢ ᱟᱨ ᱥᱚᱦᱨᱟᱭ ᱯᱚᱨᱚᱵᱽ ᱥᱮᱨᱮᱧ-ᱮᱱᱮᱡ',
        teacherHook: 'ᱥᱚᱦᱨᱟᱭ ᱨᱮ ᱟᱵᱚ ᱰᱟᱝᱜᱽᱨᱟ ᱠᱚ ᱪᱮᱫ ᱞᱮᱠᱟ ᱵᱚᱱ ᱥᱟᱡᱟᱣ ᱠᱚᱣᱟ? ᱵᱷᱤᱛ ᱨᱮ ᱥᱚᱦᱨᱟᱭ ᱪᱤᱛᱟᱹᱨ ᱚᱠᱚᱭ ᱵᱮᱱᱟᱣᱟ?',
        coreExplanation: 'ᱥᱚᱦᱨᱟᱭ ᱫᱚ ᱪᱟᱥ-ᱵᱟᱥ ᱨᱮᱭᱟᱜ ᱢᱟᱨᱟᱝ ᱯᱚᱨᱚᱵᱽ ᱠᱟᱱᱟ ᱟᱨ ᱠᱟᱨᱟᱢ ᱫᱚ ᱵᱤᱨ-ᱫᱟᱨᱮ ᱫᱩᱜ ᱫᱚᱦᱚ ᱨᱮᱭᱟᱜ।',
        vocabulary: [
          { hi: 'त्योहार / पर्व', tribal: 'ᱯᱚᱨᱚᱵᱽ', romanAid: 'Porob', en: 'Festival' },
          { hi: 'नाचना', tribal: 'ᱮᱱᱮᱡ', romanAid: 'Enej', en: 'Dance' },
          { hi: 'गाना', tribal: 'ᱥᱮᱨᱮᱧ', romanAid: 'Serenj', en: 'Song / Sing' },
          { hi: 'मांदर (ढोल)', tribal: 'ᱛᱩᱢᱫᱟᱜ', romanAid: 'Tumdak', en: 'Tribal Drum' },
          { hi: 'बांसुरी', tribal: 'ᱛᱤᱨᱤᱭᱚ', romanAid: 'Tiriyo', en: 'Flute' },
          { hi: 'दीवार चित्र', tribal: 'ᱵᱷᱤᱛ ᱪᱤᱛᱟᱹᱨ', romanAid: 'Bhit Chitar', en: 'Wall Art' }
        ]
      }
    }
  },

  // ── PACK 8: Animals & Birds around us ──────────────────────────────────────
  {
    id: 'fln-animal-1',
    contentStatus: 'demo',
    title: 'हमारे आस-पास के पशु-पक्षी एवं उनकी बोलियाँ',
    competencyCode: 'FLN-E2.1',
    competencyTitle: 'जीव-जगत पहचान एवं ध्वनि अनुकरण (Fauna & Animal Sounds)',
    gradeLevel: '1-2',
    subject: 'EVS & Language (पर्यावरण व भाषा)',
    theme: 'पशु-पक्षी (Animals & Birds)',
    lessonScript: {
      teacherHook: 'मुर्गा सुबह कैसे बोलता है? क्या आपको पता है कि संताली में तोता, मोर और गाय को क्या कहते हैं?',
      coreExplanation: 'हमारे आस-पास कई तरह के जानवर रहते हैं। गाय हमें दूध देती है, कुत्ता घर की रखवाली करता है और मोर जंगल में नाचता है।',
      stepByStep: [
        'गाय — ᱜᱟᱹᱭ (Gay)',
        'बैल — ᱰᱟᱝᱜᱽᱨᱟ (Dangra)',
        'बकरी — ᱢᱮᱨᱚᱢ (Merom)',
        'मुर्गी / मुर्गा — ᱥᱤᱢ (Sim)',
        'चिड़िया / पक्षी — ᱪᱮᱬᱮ (Chene)',
        'मोर — ᱢᱟᱨᱟᱜ (Marag)'
      ]
    },
    classroomActivity: {
      name: 'पशु-पक्षी ध्वनि और चाल अनुकरण (Animal Mimicry & Sound Game)',
      instructions: 'एक बच्चा किसी जानवर की चाल या आवाज़ निकालेगा, बाकी बच्चे संताली में उस जानवर का नाम बताएंगे।',
      materialsNeeded: 'जानवरों के चित्र फ्लैशकार्ड'
    },
    assessmentPrompts: [
      'संताली में मोर को क्या कहते हैं?',
      '"ᱢᱮᱨᱚᱢ" का हिंदी में क्या अर्थ है?'
    ],
    translations: {
      santali: {
        scriptName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
        title: 'ᱟᱵᱚ ᱟᱰᱮ-ᱯᱟᱥᱮ ᱨᱤᱱ ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱟᱨ ᱪᱮᱬᱮ ᱠᱚ',
        teacherHook: 'ᱥᱤᱢ ᱥᱮᱛᱟᱜ ᱪᱮᱫ ᱞᱮᱠᱟᱭ ᱨᱟᱜᱟ? ᱟᱯᱮ ᱪᱮᱫ ᱜᱟᱹᱭ, ᱢᱟᱨᱟᱜ ᱟᱨ ᱢᱮᱨᱚᱢ ᱟᱜ ᱥᱟᱱᱛᱟᱲᱤ ᱧᱩᱛᱩᱢ ᱵᱟᱰᱟᱭᱟ?',
        coreExplanation: 'ᱜᱟᱹᱭ ᱫᱚ ᱛᱳᱣᱟᱭ ᱮᱢᱟᱵᱚᱱᱟ, ᱥᱮᱛᱟ ᱫᱚ ᱚᱲᱟᱜ ᱮ ᱨᱩᱠᱷᱤᱭᱟᱹᱭᱟ ᱟᱨ ᱢᱟᱨᱟᱜ ᱫᱚ ᱵᱤᱨ ᱨᱮᱭ ᱮᱱᱮᱡ-ᱟ।',
        vocabulary: [
          { hi: 'गाय', tribal: 'ᱜᱟᱹᱭ', romanAid: 'Gay', en: 'Cow' },
          { hi: 'बैल', tribal: 'ᱰᱟᱝᱜᱽᱨᱟ', romanAid: 'Dangra', en: 'Ox / Bull' },
          { hi: 'बकरी', tribal: 'ᱢᱮᱨᱚᱢ', romanAid: 'Merom', en: 'Goat' },
          { hi: 'मुर्गी', tribal: 'ᱥᱤᱢ', romanAid: 'Sim', en: 'Hen / Rooster' },
          { hi: 'पक्षी', tribal: 'ᱪᱮᱬᱮ', romanAid: 'Chene', en: 'Bird' },
          { hi: 'मोर', tribal: 'ᱢᱟᱨᱟᱜ', romanAid: 'Marag', en: 'Peacock' },
          { hi: 'कुत्ता', tribal: 'ᱥᱮᱛᱟ', romanAid: 'Seta', en: 'Dog' }
        ]
      }
    }
  }
];
