// need to work on this...

exports.throwError = function (status, message) {
    const error = new Error(message);
    error.status = status.toString();


    // this middle-ware sends the error to the client
    switch (error.status) {
        case "401":
        case "403":
            res.status(error.status).send({ message: error.message });
        case "404":
            res.status(error.status).render("404");

    }
}

