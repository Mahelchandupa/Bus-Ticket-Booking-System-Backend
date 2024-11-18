const responseHandler = (message, statusCode = 200, data = {}) => {
  const response = {
    message: message,
    statusCode: statusCode,
  };

  // Add data only if it has values (is not empty)
  if (Object.keys(data).length > 0) {
    response.data = data;
  }

  return JSON.stringify(response);
};

module.exports = { responseHandler };
