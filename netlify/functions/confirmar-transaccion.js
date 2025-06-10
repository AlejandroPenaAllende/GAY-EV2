exports.handler = async (event, context) => {

  const { token } = JSON.parse(event.body);

  const url = `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions/${token}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': '597055555532',
        'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error al confirmar transacción:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error al confirmar transacción', error })
      };
    }

    const data = await response.json();
    console.log('Respuesta confirmación:', data);

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