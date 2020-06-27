exports.throwError = function (status, message, callback) {
    const error = new Error(message);
    error.status = status.toString();
    return callback(error);
}