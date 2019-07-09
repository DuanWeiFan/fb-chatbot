'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.enc.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', (req, res) => {
	res.send("Hi I'm a chatbot")
})

// Facebook

app.get('/webhook/', (req, res) => {
	if (req.query['hub.verify_token'] === "") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.listening(app.get('port'), () => {
	console.log("running: port")
})