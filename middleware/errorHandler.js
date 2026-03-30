const errorHandler = (err, req, res, next) => {
    // Set the status code to 500 if it is not already set, and send a JSON response with the error message
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        // Include the stack trace in the response if the application is running in development mode for easier debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;