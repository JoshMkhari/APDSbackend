const express = require('express')
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


router.post('/signup',(req, res)=>{
    bcrypt.hash(req.body.password,10)
        .then(hash=>{
            const user = new User(
                {
                    username: req.body.username,
                    password: hash
                }
            );
            user.save()
                .then(result => {
                    res.status(201).json({
                        message:'User Created',
                        user:user
                    });
                }).
            catch(err =>{
                res.status(500).json({
                    error:err
                });
        })
    });
})

router.delete('/:id',(req, res)=>
{
    User.deleteOne({_id: req.params.id})
        .then((result)=>{
            res.status(200).json({message : 'User Deleted Successfully'})
        })
})

router.post('/login',(req, res) => {
    let fetchedUser;
    User.findOne({username:req.body.username})
        .then(user=>{
            try
            {
                fetchedUser = user;
                const token = jwt.sign({username:fetchedUser.username,userId: fetchedUser._id},
                    'secret_this_should_be_longer_than_it_is',
                    {expiresIn:'1h'},0);
                res.status(200).json({token:token})
            }
            catch (error)
            {
                return res.status(401).json(
                    {
                        message: "Authentication Failure",
                    }
                );
            }
        })
        .catch(err =>{
            return res.status(401).json({
                message: "Authentication Failure"
            });
        })
})


module.exports = router