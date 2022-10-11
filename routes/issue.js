const express = require('express')
const router = express.Router();
const Issue = require("../models/issue");
const checkauth = require('../check-auth')

router.get( '',(req,res)=>
{
    Issue.find().then((fruits)=>{
        res.json(
            {
                message: "Issue found",
                fruits:fruits
            }
        )
    })
})
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
    res.status(201).json(
        {
            message: 'Issue created',
            issue: issue
        }
    )
})
router.delete('/:id',checkauth,(req, res)=>
{
    Issue.deleteOne({_id: req.params.id})
        .then((result)=>{
            res.status(200).json({message : 'Issue Deleted Successfully'})
        })
})
module.exports = router;