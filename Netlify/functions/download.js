// netlify/functions/download.js
exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'audio/mpeg',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  try {
    const { file, text = 'Generated audio file' } = event.queryStringParameters;

    // Create a simulated MP3 file
    const audioContent = `This is a simulated MP3 file for: ${text}`;
    
    // Return as downloadable file
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Disposition': `attachment; filename="${file || 'audio.mp3'}"`,
        'Content-Length': audioContent.length.toString(),
      },
      body: audioContent,
    };

  } catch (error) {
    console.error('Download Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Download failed',
        message: error.message 
      }),
    };
  }
};