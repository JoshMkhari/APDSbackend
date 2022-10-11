const express = require('express')
const app = express()
const urlprefix = '/api'
const mongoose = require('mongoose')
const Issue = require('./models/issue')
const fs = require('fs');
const cert = fs.readFileSync('keys/certificate.pem')

const options = {
    server: {sslCA: cert}};
const connstring = "mongodb+srv://adminjosh:ZX8S3mpL6UHt5ne@cluster0.ecr945g.mongodb.net/?retryWrites=true&w=majority"

const issueRoutes = require('./routes/issue');
const userRoutes = require('./routes/user')

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
app.get(urlprefix +'/',(req,res)=>
{
    res.send('Hello World')
})

app.use(urlprefix+'/issue', issueRoutes)
app.use(urlprefix+'/users', userRoutes)

module.exports = app;