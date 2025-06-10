// netlify/functions/crear-transaccion.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { amount, productIds } = JSON.parse(event.body);

    if (!amount || !productIds || !Array.isArray(productIds)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Faltan datos: amount y productIds[] son requeridos.' })
      };
    }

    const session_id = `productos-${productIds.join(',')}`; // Ej: productos-1,3,5

    const body = {
      buy_order: `orden-${Date.now()}`, // identificador único
      session_id: session_id,
      amount: amount,
      return_url: 'https://masagua.netlify.app/.netlify/functions/retorno'
    };

    const response = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions', {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': '597055555532',
        'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error en Transbank:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error en Transbank', error })
      };
    }

    const data = await response.json();
    console.log('Respuesta Webpay:', data);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno', error: error.toString() })
    };
  }
};
