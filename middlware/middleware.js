const jwt = require("jsonwebtoken");

const authoriseVolcano = (req,res,next) => {
    const authorization = req.headers.authorization;
    
    if(!authorization){
        next();
        return;
    }

    const token = authorization;

    try{
        const decoded = jwt.verify(token, "secret key");

        if(decoded.exp < Date.now()){
            console.log("Token has expired");
            res.status(401).json({
                error: true, 
                message:"Invalid JWT token"
            })
            res.end();
        }
        next();
    }catch(e){
        res.status(401).json({
            error: true, 
            message:"Invalid JWT token"
        })
        res.end();
    }
}

const authoriseGetProfile = (req,res,next) => {
    const authorization = req.headers.authorization;

    if(!authorization){
        next();
    }

    const token = authorization;

    try{
        const decoded = jwt.verify(token, "secret key");
        
        if(decoded.exp < Date.now()){
            console.log("Token has expired");
            res.status(401).json({
                error: true, 
                message:"JWT token has expired"
            })
            return;
        }
        next();
    }catch(e){
        res.status(401).json({
            error: true, 
            message:"Invalid query parameters. Query parameters are not permitted."
        })
    }
}

const authorisePutVolcano = (req,res,next) => {
    const authorization = req.headers.authorization;

    if(!authorization){
        next();
    }

    const token = authorization;

    try{
        const decoded = jwt.verify(token, "secret key");
        
        if(decoded.exp < Date.now()){
            console.log("Token has expired");
            res.status(401).json({
                error: true, 
                message:"Authorization header ('Bearer token') not found"
            })
            return;
        }
        next();
    }catch(e){
        res.status(401).json({
            error: true, 
            message:"Invalid query parameters. Query parameters are not permitted."
        })
    }
}

module.exports = {authoriseVolcano, authoriseGetProfile, authorisePutVolcano};