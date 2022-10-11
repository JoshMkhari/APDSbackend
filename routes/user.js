const express = require('express')
const router = express.Router();
const User = require("../models/user");

router.post('/signup',(req, res)=>{
    const user = new User(
        {
            username: req.body.username,
            password: req.body.password
        }
    )
    user.save();
    res.status(201).json({
        message:'User Created',
        user:user
    })
})

module.exports = router