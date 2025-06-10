exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const body = new URLSearchParams(event.body);
  const token = body.get('token_ws');

  if (!token) {
    return {
      statusCode: 400,
      body: 'Token no encontrado'
    };
  }

  return {
    statusCode: 302,
    headers: {
      Location: `https://masagua.netlify.app/html/result.html?token_ws=${token}`
    }
  };
};
