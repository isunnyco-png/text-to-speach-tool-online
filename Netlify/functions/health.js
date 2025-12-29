// netlify/functions/health.js
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

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'operational',
      service: 'text-to-speech-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        tts: '/.netlify/functions/tts',
        translate: '/.netlify/functions/translate',
        health: '/.netlify/functions/health',
      },
      features: [
        'Text-to-Speech conversion',
        'Multi-language support',
        'Voice customization',
        'Translation simulation',
        'Audio export',
      ],
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }),
  };
};