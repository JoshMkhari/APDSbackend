const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log(req.headers.authorization)
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