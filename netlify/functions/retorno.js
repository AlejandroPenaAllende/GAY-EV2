exports.handler = async (event) => {
  const params = event.queryStringParameters;
  const token = params.token_ws;

  return {
    statusCode: 302,
    headers: {
      Location: `https://masagua.netlify.app/html/result.html?token_ws=${token}`
    }
  };
};
