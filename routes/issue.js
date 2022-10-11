//https://www.w3schools.com/nodejs/nodejs_modules.asp
const express = require('express')
const router = express.Router();
const Issue = require("../models/issue");
const checkauth = require('../check-auth')

//https://www.json.org/json-en.html
router.get( '',checkauth,(req,res)=>
{
    Issue.find().then((issue)=>{
        res.json(
            {
                message: "Issue found",
                issue:issue
            }
        )
    })
})
//https://expressjs.com/en/api.html#express.json
router.post('',checkauth,(req, res) =>
{
    const issue = new Issue(
        {
            id: req.body.id,
            name: req.body.name
        }
    )
    issue.save().then(()=>{
        res.status(201).json({
            message: 'Issue created',
            issue:issue
        })
    });
})

router.delete('/:id',checkauth,(req, res)=>
{
    Issue.deleteOne({_id: req.params.id})
        .then((result)=>{
            res.status(200).json({message : 'Issue Deleted Successfully'})
        })
})
module.exports = router;