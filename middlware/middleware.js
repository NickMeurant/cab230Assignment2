const jwt = require("jsonwebtoken");

const authoriseVolcano = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        next();
        return;
    }

    const token = authorization;

    try {
        const decoded = jwt.verify(token, "secret key");

        if (decoded.exp < Date.now()) {
            console.log("Token has expired");
            res.status(401).json({
                error: true,
                message: "Invalid JWT token"
            })
            res.end();
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

const authoriseGetProfile = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        next();
        return;
    }

    const token = authorization;

    try {
        const decoded = jwt.verify(token, "secret key");

        if (decoded.exp < Date.now()) {
            console.log("Token has expired");
            res.status(401).json({
                error: true,
                message: "JWT token has expired"
            })
            res.end();
        }
        next();
    } catch (e) {
        res.status(401).json({
            error: true,
            message: "Invalid query parameters. Query parameters are not permitted."
        })
        res.end();
    }
}

const authorisePutProfile = (req, res, next) => {
    const authorization = req.headers.authorization;
    const email = req.params.email;

    if (!authorization) {
        res.status(403).json({
            error: true,
            message: "Forbidden"
        })
        res.end();
    }

    const token = authorization;

    if (token) {
        const decoded = jwt.verify(token, "secret key");
        if (decoded.email === email) {
            sameEmail = true;
        } else {
            res.status(403).json({
                error: true,
                message: "Forbidden"
            })
            return;
        }
    }

    try {
        const decoded = jwt.verify(token, "secret key");

        if (decoded.exp < Date.now()) {
            console.log("Token has expired");
            res.status(401).json({
                error: true,
                message: "Authorization header ('Bearer token') not found"
            })
            res.end();
        }
        next();
    } catch (e) {
        res.status(401).json({
            error: true,
            message: "Invalid query parameters. Query parameters are not permitted."
        })
        res.end();
    }
}

module.exports = { authoriseVolcano, authoriseGetProfile, authorisePutProfile };