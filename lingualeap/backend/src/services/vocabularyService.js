// Comprehensive vocabulary database
const vocabularyDatabase = {
  greetings: {
    words: [
      { en: 'Hello', fr: 'Bonjour', es: 'Hola', de: 'Hallo', hi: 'नमस्ते', zh: '你好', phonetic: { fr: '/bon.ˈʒuʁ/', es: '/ˈola/', de: '/haˈloː/' } },
      { en: 'Goodbye', fr: 'Au revoir', es: 'Adiós', de: 'Auf Wiedersehen', hi: 'अलविदा', zh: '再见', phonetic: { fr: '/o ʁə.ˈvwaʁ/', es: '/aˈðjos/', de: '/ˌaʊf ˈviːdɐˌzeːən/' } },
      { en: 'Thank you', fr: 'Merci', es: 'Gracias', de: 'Danke', hi: 'धन्यवाद', zh: '谢谢', phonetic: { fr: '/mɛʁ.ˈsi/', es: '/ˈɡɾa.θjas/', de: '/ˈdaŋ.kə/' } },
      { en: 'Please', fr: 'S\'il vous plaît', es: 'Por favor', de: 'Bitte', hi: 'कृपया', zh: '请', phonetic: { fr: '/sil vu ˈplɛ/', es: '/poɾ faˈβoɾ/', de: '/ˈbɪ.tə/' } },
      { en: 'Excuse me', fr: 'Excusez-moi', es: 'Disculpe', de: 'Entschuldigung', hi: 'माफ़ करें', zh: '对不起', phonetic: { fr: '/ɛks.ky.ze ˈmwa/', es: '/disˈkul.pe/', de: '/ɛntˈʃʊl.dɪ.ɡʊŋ/' } },
      { en: 'Yes', fr: 'Oui', es: 'Sí', de: 'Ja', hi: 'हाँ', zh: '是', phonetic: { fr: '/wi/', es: '/si/', de: '/jaː/' } },
      { en: 'No', fr: 'Non', es: 'No', de: 'Nein', hi: 'नहीं', zh: '不', phonetic: { fr: '/nɔ̃/', es: '/no/', de: '/naɪn/' } },
      { en: 'Good morning', fr: 'Bonjour', es: 'Buenos días', de: 'Guten Morgen', hi: 'सुप्रभात', zh: '早上好', phonetic: { fr: '/bon.ˈʒuʁ/', es: '/ˈbwe.nos ˈdi.as/', de: '/ˈɡuː.tən ˈmɔʁ.ɡən/' } },
      { en: 'Good evening', fr: 'Bonsoir', es: 'Buenas noches', de: 'Guten Abend', hi: 'शुभ संध्या', zh: '晚上好', phonetic: { fr: '/bon.ˈswaʁ/', es: '/ˈbwe.nas ˈno.tʃes/', de: '/ˈɡuː.tən ˈaː.bənt/' } },
      { en: 'How are you?', fr: 'Comment allez-vous?', es: '¿Cómo está?', de: 'Wie geht es Ihnen?', hi: 'आप कैसे हैं?', zh: '你好吗?', phonetic: { fr: '/ko.mɑ̃ ta.le ˈvu/', es: '/ˈko.mo esˈta/', de: '/viː ɡeːt ɛs ˈiː.nən/' } }
    ],
    sentences: [
      { en: 'Nice to meet you', fr: 'Enchanté de vous rencontrer', es: 'Mucho gusto', de: 'Freut mich, Sie kennenzulernen', hi: 'आपसे मिलकर खुशी हुई', zh: '很高兴见到你' },
      { en: 'My name is John', fr: 'Je m\'appelle John', es: 'Mi nombre es John', de: 'Ich heiße John', hi: 'मेरा नाम जॉन है', zh: '我叫约翰' },
      { en: 'Where are you from?', fr: 'D\'où venez-vous?', es: '¿De dónde eres?', de: 'Woher kommen Sie?', hi: 'आप कहाँ से हैं?', zh: '你来自哪里?' }
    ]
  },
  food: {
    words: [
      { en: 'Water', fr: 'Eau', es: 'Agua', de: 'Wasser', hi: 'पानी', zh: '水', phonetic: { fr: '/o/', es: '/ˈa.ɣwa/', de: '/ˈva.sɐ/' } },
      { en: 'Bread', fr: 'Pain', es: 'Pan', de: 'Brot', hi: 'रोटी', zh: '面包', phonetic: { fr: '/pɛ̃/', es: '/pan/', de: '/bʁoːt/' } },
      { en: 'Coffee', fr: 'Café', es: 'Café', de: 'Kaffee', hi: 'कॉफी', zh: '咖啡', phonetic: { fr: '/ka.ˈfe/', es: '/kaˈfe/', de: '/ˈka.feː/' } },
      { en: 'Tea', fr: 'Thé', es: 'Té', de: 'Tee', hi: 'चाय', zh: '茶', phonetic: { fr: '/te/', es: '/te/', de: '/teː/' } },
      { en: 'Apple', fr: 'Pomme', es: 'Manzana', de: 'Apfel', hi: 'सेब', zh: '苹果', phonetic: { fr: '/pɔm/', es: '/manˈθa.na/', de: '/ˈap.fəl/' } },
      { en: 'Rice', fr: 'Riz', es: 'Arroz', de: 'Reis', hi: 'चावल', zh: '米饭', phonetic: { fr: '/ʁi/', es: '/aˈroθ/', de: '/ʁaɪs/' } },
      { en: 'Fish', fr: 'Poisson', es: 'Pescado', de: 'Fisch', hi: 'मछली', zh: '鱼', phonetic: { fr: '/pwa.ˈsɔ̃/', es: '/pesˈka.do/', de: '/fɪʃ/' } },
      { en: 'Chicken', fr: 'Poulet', es: 'Pollo', de: 'Huhn', hi: 'मुर्गी', zh: '鸡肉', phonetic: { fr: '/pu.ˈlɛ/', es: '/ˈpo.ʎo/', de: '/huːn/' } }
    ]
  },
  travel: {
    words: [
      { en: 'Airport', fr: 'Aéroport', es: 'Aeropuerto', de: 'Flughafen', hi: 'हवाईअड्डा', zh: '机场' },
      { en: 'Hotel', fr: 'Hôtel', es: 'Hotel', de: 'Hotel', hi: 'होटल', zh: '酒店' },
      { en: 'Train', fr: 'Train', es: 'Tren', de: 'Zug', hi: 'ट्रेन', zh: '火车' },
      { en: 'Bus', fr: 'Bus', es: 'Autobús', de: 'Bus', hi: 'बस', zh: '公共汽车' },
      { en: 'Taxi', fr: 'Taxi', es: 'Taxi', de: 'Taxi', hi: 'टैक्सी', zh: '出租车' }
    ]
  }
};

// Image URLs for different categories
const imageDatabase = {
  greetings: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop', // people greeting
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop', // handshake
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', // waving
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop'  // meeting
  ],
  food: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop', // food spread
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop', // ingredients
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop', // cooking
    'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=300&h=200&fit=crop'  // fruits
  ],
  travel: [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop', // travel
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop', // airport
    'https://images.unsplash.com/photo-1544986581-efac024faf62?w=300&h=200&fit=crop', // hotel
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop'  // transportation
  ]
};

function generateVocabulary(topic, type, targetLang, nativeLang, count = 10) {
  const topicKey = topic.toLowerCase().replace(/[^a-z]/g, '');
  const topicData = vocabularyDatabase[topicKey] || vocabularyDatabase.greetings;
  const images = imageDatabase[topicKey] || imageDatabase.greetings;
  
  const items = type === 'word' ? topicData.words : (topicData.sentences || topicData.words);
  const result = [];
  
  for (let i = 0; i < Math.min(count, items.length); i++) {
    const item = items[i];
    const imageUrl = images[i % images.length];
    
    result.push({
      id: `${topicKey}_${type}_${i + 1}`,
      textNativeLanguage: item[nativeLang] || item.en,
      textTargetLanguage: item[targetLang] || item.en,
      phoneticTranscription: item.phonetic?.[targetLang],
      topic: topic,
      difficultyLevel: 1,
      type: type,
      imageUrl: imageUrl,
      usageContext: `Learning ${topic.toLowerCase()}`,
      usageExample: `Example: ${item[targetLang] || item.en}`,
      nativeLanguageCode: nativeLang,
      targetLanguageCode: targetLang
    });
  }
  
  return result;
}

module.exports = { generateVocabulary };