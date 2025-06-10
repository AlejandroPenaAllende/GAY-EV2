const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

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
      // Extraer ID del producto comprado (supongamos lo metiste en session_id)
      const session_id = data.session_id; // ← Esto depende de cómo lo configuraste en crear-transacción
      const productId = parseInt(session_id.replace('producto-', '')); // Ejemplo

      // Reducir el stock del producto en Supabase
      const { error } = await supabase
        .from('productos')
        .update({ stock: supabase.rpc('decrementar_stock', { producto_id: productId }) }) // o resta manual
        .eq('id', productId);

      if (error) {
        console.error('Error al actualizar stock en Supabase:', error);
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
