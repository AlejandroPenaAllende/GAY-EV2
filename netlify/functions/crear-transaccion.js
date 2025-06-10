// netlify/functions/crear-transaccion.js
exports.handler = async (event, context) => {
  const { amount } = JSON.parse(event.body);

  const url = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions';

  const body = {
    "buy_order": "ordenCompra12345678",
    "session_id": "sesion1234557545",
    "amount": 10000,
    "return_url": "https://webhook.site/0fd266dc-90de-44d7-ad07-ea1edc4a19fb"
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
