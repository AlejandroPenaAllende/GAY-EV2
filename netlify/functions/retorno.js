const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Configura tu Supabase
const supabase = createClient(
  'https://TU-PROYECTO.supabase.co',
  'TU_SUPABASE_ANON_KEY'
);

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

  try {
    // Confirmar transacción con Webpay
    const response = await fetch(`https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions/${token}`, {
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': '597055555532',
        'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const status = data.status === 'AUTHORIZED' ? 'success' : 'failed';

    if (status === 'success') {
      // Leer el session_id (ej: "productos-1,2,5")
      const session_id = data.session_id || '';
      const idPart = session_id.split('productos-')[1]; // "1,2,5"
      const productIds = idPart ? idPart.split(',').map(id => parseInt(id)) : [];

      for (const id of productIds) {
        const { error } = await supabase
          .from('productos')
          .update({ stock: supabase.raw('stock - 1') }) // o resta manual
          .eq('id', id)
          .gt('stock', 0); // Asegura que haya stock

        if (error) {
          console.error(`Error actualizando stock del producto ${id}:`, error);
        }
      }
    }

    return {
      statusCode: 302,
      headers: {
        Location: `https://masagua.netlify.app/html/result.html?token_ws=${token}&status=${status}`
      }
    };
  } catch (error) {
    console.error('Error al confirmar transacción:', error);
    return {
      statusCode: 500,
      body: 'Error al confirmar transacción'
    };
  }
};
