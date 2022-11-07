//https://www.w3schools.com/nodejs/nodejs_modules.asp
const express = require('express')
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('connect-flash');
let ExpressBrute = require('express-brute'),
    MongoStore = require('express-brute-mongo'),
    moment = require('moment'),
    store = new ExpressBrute.MemoryStore();
const config = require("nodemon/lib/config");

const failCallback = function (req, res, next, nextValidRequestDate) {
   // localStorage.setItem('timer',)
    return res.status(401).json(
        {
            message: "You've made too many failed attempts in a short period of time, please try again " + moment(nextValidRequestDate).fromNow()
        }
    );
    //res.redirect('/login'); // brute force protection triggered, send them back to the login page
};
const handleStoreError = function (error) {
    log.error(error); // log this error so we can figure out what went wrong
    // cause node to exit, hopefully restarting the process fixes the problem
    throw {
        message: error.message,
        parent: error.parent
    };
};
// Start slowing requests after 5 failed attempts to do something for the same user
const userBruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 60 * 60 * 1000, // 1 hour,
    failCallback: failCallback,
    handleStoreError: handleStoreError
});
// No more than 1000 login attempts per day per IP
const globalBruteforce = new ExpressBrute(store, {
    freeRetries: 1000,
    attachResetToRequest: false,
    refreshTimeoutOnRequest: false,
    minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
    maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
    lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
    failCallback: failCallback,
    handleStoreError: handleStoreError
});

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

router.post('/login',globalBruteforce.prevent,userBruteforce.getMiddleware({
    key: function(req, res, next) {
        // prevent too many attempts for the same username
        next(req.body.username);
    }
}),(req, res) => {
    let fetchedUser;
    User.findOne({username:req.body.username})
        .then(user=>{
            try
            {
                fetchedUser = user;
                bcrypt.compare(req.body.password, fetchedUser.password, function(err, result) {
                    if (result) {
                        const token = jwt.sign({username:fetchedUser.username,userId: fetchedUser._id},
                            'secret_this_should_be_longer_than_it_is',
                            {expiresIn:'1h'},0);
                        res.status(200).json({token:token})
                        // reset the failure counter so next time they log in they get 5 tries again before the delays kick in
                        req.brute.reset(function () {
                            // logged in, send them to the home page
                        });
                    } else {
                        // response is OutgoingMessage object that server response http request
                        return res.status(401).json(
                            {
                                message: "Authentication Failure"
                            }
                        );
                    }
                });
            }
            catch (error)
            {
                return res.status(401).json(
                    {
                        message: "Authentication Failure"
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