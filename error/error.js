const errorHandler = (message, statusCode = 500) => {
    return JSON.stringify({
        error: {
            message: message,
            statusCode: statusCode,
        }
    });
};

module.exports = { errorHandler };
