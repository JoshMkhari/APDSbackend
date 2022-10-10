const express = require('express')
const app = express()
const urlprefix = '/api'
const mongoose = require('mongoose')
const Fruit = require('./models/fruit')
const fs = require('fs');
const cert = fs.readFileSync('keys/certificate.pem')

const options = {
    server: {sslCA: cert}};
const connstring = "mongodb+srv://adminjosh:ZX8S3mpL6UHt5ne@cluster0.ecr945g.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(connstring).then(()=>
{git
    console.log('Connected :-D')
}).catch(()=>{
    console.log('Not Connected:-(')
}, options);

app.get(urlprefix +'/',(req,res)=>
{
    res.send('Hello World')
})

app.get(urlprefix +'/orders',(req,res)=>
{
    const orders = [
        {
            id: "1",
            name: "Orange"
        },
        {
            id: "2",
            name: "Banana"
        },
        {
            id: "3",
            name: "Pear"
        }
    ]
    res.json(
        {
            message: "Fruits",
            orders: orders
        }
    )
})

module.exports = app;