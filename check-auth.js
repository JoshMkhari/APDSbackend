const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        //https://stackoverflow.com/questions/48813683/req-headers-split-is-not-a-function-when-getting-token-from-header
        const token = req.headers.authorization.split( ' ')[1];
        jwt.verify(token,"secret_this_should_be_longer_than_it_is",0,0)
        next();
    }
    catch (error)
    {
        res.status(401).json({
            message:"Invalid token"
        });
    }
};