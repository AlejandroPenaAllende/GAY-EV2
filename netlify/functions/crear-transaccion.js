// netlify/functions/crear-transaccion.js
exports.handler = async (event, context) => {
  const { amount } = JSON.parse(event.body);

  const url = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions';

  const body = {
    buy_order: 'order00001',
    session_id: 'session00001',
    amount: amount,
    return_url: 'https://masagua.netlify.app/html/result'
  };

  try {
    const response = await fetch(url, {
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
