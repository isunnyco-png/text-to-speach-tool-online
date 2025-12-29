// netlify/functions/tts.js
const axios = require('axios');
const crypto = require('crypto');

exports.handler = async function(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
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

    const { text, language = 'en-US', voice = 'male', speed = 1.0, pitch = 1.0 } = JSON.parse(event.body);

    if (!text || text.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    console.log('TTS Request:', { text: text.substring(0, 100), language, voice });

    // Generate a unique filename
    const timestamp = Date.now();
    const hash = crypto.createHash('md5').update(text + timestamp).digest('hex');
    const filename = `tts_${timestamp}_${hash.substring(0, 8)}.mp3`;

    // Simulate audio generation (in production, use actual TTS service)
    const simulatedAudioData = {
      success: true,
      audio: {
        filename: filename,
        url: `https://api.voicerss.org/?key=demo&hl=${language}&src=${encodeURIComponent(text.substring(0, 100))}`,
        text_length: text.length,
        estimated_duration: Math.ceil(text.length / 15), // seconds
        format: 'mp3',
        size: Math.ceil(text.length * 100), // simulated size in bytes
      },
      details: {
        language: language,
        voice: voice,
        speed: speed,
        pitch: pitch,
        timestamp: new Date().toISOString(),
      },
      message: 'TTS generated successfully (simulated)',
      note: 'In production, connect to Google TTS, Amazon Polly, or VoiceRSS API',
    };

    // For demo, we'll also return some audio data that can be played
    const audioBase64 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAABZAAMEBQYHCAsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAEBAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8=';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...simulatedAudioData,
        audio_data: audioBase64, // Base64 encoded audio for demo
        download_url: `/api/download?file=${filename}&text=${encodeURIComponent(text.substring(0, 50))}`,
      }),
    };

  } catch (error) {
    console.error('TTS Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate TTS',
        message: error.message,
        note: 'Please check your text input and try again'
      }),
    };
  }
};