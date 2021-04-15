const express = require('express')
const app = express()
const port = 3000
const helmet = require("helmet")
const bodyParser = require('body-parser')
const yup = require('yup')
const { text } = require('body-parser')
const formidable = require('formidable')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const cors = require("cors")
app.use(cors())
const PATHS = {
INFO: "/info",
HELLO: "/hello",
STORE: "/store",
PARSE: "/parse",
LOGIN: "/login",
PROFILE: "/profile",
}
const { LOGIN, PASSWORD, PRIVATE_KEY } = require ('./consts.js')
const login = LOGIN
const password = PASSWORD
const private_key = PRIVATE_KEY
var token = jwt.sign ( { login }, private_key)
app.use(helmet())
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.post('/login',(req,res)=>{
if(req.body.login == login && req.body.password == password){
res.status(200)
res.send(token)
}else{
res.status(401)
res.send("Invalid login data")
}
})
app.get('/profile',(req,res)=>{
jwt.verify(token, private_key, function(err,decoded){
if(!err){
res.status(200)
var log = { "login" : 'test' }
res.json(log)
}
else {
res.status(401)}
})
})
app.get('/info',(req,res)=> {
	var pjson = require('./package.json')
	res.json('author:'+pjson.author)
	res.status(200)
})
app.get('/hello/:name',(req,res)=>{
var name = req.params.name
var schema = yup.string().max(10).matches(/^[a-zA-Z]+$/).required()
if(schema.isValidSync(name)){
res.status(200)
res.send('Hello ' + name + '!')
}else{
res.status(400)
res.send('Name is not valid')
}
})
let tab =[]
app.post('/store', (req, res)=>{
tab.push(req.body.input)
res.status(201)
res.json({
	stored_data: tab
	})
})

app.post('/parse', (req, res)=>{
const form = formidable({ multiples: true })
var toJson="{\""
var isOpen = false
form.parse(req, (err,fields, files)=>{

var path = files.toParse.path
console.log(path)
fs.readFile(path, (err, data) => {
if (err)
{
	res.status(500)

}
var text = data.toString();
for (let i=0; i<text.length; i++)
{
	if(text[i]==":")
{
	toJson+="\":"
let isNumberTmp = parseInt (text [i+1])
let isNumber = isNaN(isNumberTmp)
if (isNumber)
{
	toJson+="{\""
	isOpen = true
}

}
else if (text[i]==";")
{
	if(isOpen)
	{
	toJson+="}"
	isOpen=false
	}
	toJson+=",\""
}
else if (text[i]==",")
{
	toJson+=",\""
}
else {
	toJson+=text[i]
}
}
if(isOpen)
{
	toJson+="}"
}
toJson+="}"
toJson.trim()
console.log(toJson)
res.json(JSON.parse(toJson))
res.status(200)
})
})
})


app.post('/login'),(req,res)=>{
const log = LOGIN
const password = PASSWORD
}
const runServer = (port) => {
app.listen(port, () => {
	console.log('Example app listening at http://localhost:${port}')
})}

module.exports = {
runServer,
app,
PATHS,
}
