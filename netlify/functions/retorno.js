const fetch = require('node-fetch');

exports.handler = async (event) => {
  console.log('Método:', event.httpMethod);
  console.log('Body recibido:', event.body);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = new URLSearchParams(event.body);
  const token = body.get('token_ws');
  console.log('Token recibido:', token);

  if (!token) {
    return { statusCode: 400, body: 'Token no encontrado' };
  }

  try {
    const webpayResponse = await fetch(`https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions/${token}`, {
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': '597055555532',
        'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        'Content-Type': 'application/json'
      }
    });

    const webpayData = await webpayResponse.json();
    console.log('Respuesta Webpay:', webpayData);

    const status = webpayData.status === 'AUTHORIZED' ? 'success' : 'failed';

    return {
      statusCode: 302,
      headers: {
        Location: `https://masagua.netlify.app/html/result.html?token_ws=${token}&status=${status}`
      }
    };
  } catch (error) {
    console.error('Error en confirmación:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
