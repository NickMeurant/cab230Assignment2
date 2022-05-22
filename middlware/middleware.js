const jwt = require("jsonwebtoken");

const authoriseVolcano = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        next();
        return;
    }

    if (authorization.split(" ").length != 2) {
        res.status(401).json({
            error: true,
            message: "Authorization header is malformed"
        })
        res.end();
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, "secret key", (err, user) => {
        if (err) {
            res.status(401).json({
                error: true,
                message: "Invalid JWT token"
            })
            res.end();
            return;
        }
    })

    try {
        const decoded = jwt.verify(token, "secret key");

        if (decoded.exp < Date.now()) {
            res.status(401).json({
                error: true,
                message: "JWT token has expired"
            })
            res.end();
            return;
        }
        next();
    } catch (e) {
        res.end();
        return;
    }
}

const authoriseGetProfile = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        next();
        return;
    }

    if (authorization.split(" ").length != 2) {
        res.status(401).json({
            error: true,
            message: "Authorization header is malformed"
        })
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "secret key");

        if (decoded.exp < Date.now()) {
            res.status(401).json({
                error: true,
                message: "JWT token has expired"
            })
            res.end();
            return;
        }
        next();
    } catch (e) {
        res.status(401).json({
            error: true,
            message: "Invalid JWT token ", e
        })
        res.end();
    }
}

const authorisePutProfile = (req, res, next) => {
    const authorization = req.headers.authorization;
    const email = req.params.email;

    if (!authorization) {
        res.status(401).json({
            error: true,
            message: "Authorization header ('Bearer token') not found"
        })
        res.end();
        return;
    }

    if (authorization.split(" ").length != 2) {
        res.status(401).json({
            error: true,
            message: "Authorization header is malformed"
        })
    }

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, "secret key");
    if (decoded.email != email) {
        res.status(403).json({
            error: true,
            message: "Forbidden"
        })
        res.end();
        return;
    }

    try {
        const decoded = jwt.verify(token, "secret key");

        if (decoded.exp < Date.now()) {
            res.status(401).json({
                error: true,
                message: "JWT token has expired"
            })
            res.end();
            return;
        }
        next();
    } catch (e) {
        res.status(401).json({
            error: true,
            message: "Invalid JWT token"
        })
        res.end();
    }
}

module.exports = { authoriseVolcano, authoriseGetProfile, authorisePutProfile };