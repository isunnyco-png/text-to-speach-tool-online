// netlify/functions/translate.js
exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const { text, sourceLang = 'en', targetLang = 'es' } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required for translation' }),
      };
    }

    console.log('Translation request:', { sourceLang, targetLang, text: text.substring(0, 50) });

    // Simulate translation (in production, use Google Translate API, DeepL, etc.)
    const translations = {
      'en-es': 'Hola, esto es un texto traducido del inglés al español.',
      'es-en': 'Hello, this is text translated from Spanish to English.',
      'en-fr': 'Bonjour, ceci est un texte traduit de l\'anglais vers le français.',
      'fr-en': 'Hello, this is text translated from French to English.',
      'en-de': 'Hallo, dies ist ein vom Englischen ins Deutsche übersetzter Text.',
      'de-en': 'Hello, this is text translated from German to English.',
      'en-ja': 'こんにちは、これは英語から日本語に翻訳されたテキストです。',
      'ja-en': 'Hello, this is text translated from Japanese to English.',
    };

    const translationKey = `${sourceLang}-${targetLang}`;
    const translatedText = translations[translationKey] || 
      `[Translated from ${sourceLang} to ${targetLang}]: ${text}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        original: {
          text: text,
          language: sourceLang,
          length: text.length,
        },
        translated: {
          text: translatedText,
          language: targetLang,
          length: translatedText.length,
        },
        details: {
          source_lang: sourceLang,
          target_lang: targetLang,
          timestamp: new Date().toISOString(),
          note: 'This is a simulated translation. For real translations, use Google Translate API or similar.',
        },
      }),
    };

  } catch (error) {
    console.error('Translation Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Translation failed',
        message: error.message 
      }),
    };
  }
};