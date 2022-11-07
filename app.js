//https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview

//https://www.w3schools.com/nodejs/nodejs_modules.asp
const express = require('express')
const app = express()
const urlprefix = '/api'
const mongoose = require('mongoose')
const Issue = require('./models/issue')
const fs = require('fs');
const cert = fs.readFileSync('keys/certificate.pem')
const helmet = require("helmet");
const options = {
    server: {sslCA: cert}};
const connstring = "mongodb+srv://another:ZX8S3mpL6UHt5ne@apds.kwhd0ds.mongodb.net/?retryWrites=true&w=majority"

const issueRoutes = require('./routes/issue');
const userRoutes = require('./routes/user')
const morgan = require("morgan");

app.use(morgan('tiny'));
app.use(helmet());

mongoose.connect(connstring).then(()=>
{
    console.log('Connected :-D')
}).catch(()=>{
    console.log('Not Connected:-(')
}, options);

app.use(express.json())

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','*');
    next();
})
//https://expressjs.com/en/starter/hello-world.html
app.get(urlprefix +'/',(req,res)=>
{
    res.send('Hello World')
})

app.use(urlprefix+'/issue', issueRoutes)
app.use(urlprefix+'/users', userRoutes)

module.exports = app;