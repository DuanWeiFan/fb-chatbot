'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

token = "EAAFihsSyj70BACyhqBqNbDbsA6ZCFULsz1DnLTHxDCzen6QrRcwpFUH3oAlurpsytk3pBZAM1DfObiVPClhFSssOApV6DQJdcHRj9ZAMiZBlyVVonCQR61w9CUyVZAbqR9Qu8QOh4Q2SMwHyIK9aaji3Pk13Y3YWZAtsmSu8FcGwZDZD"

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', (req, res) => {
	res.send("Hi I'm a chatbot")
})

// Facebook

app.get('/webhook/', (req, res) => {
	if (req.query['hub.verify_token'] === "chatbot") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.post('/webhook/', (req, res) => {
	let messaging_events = req.body.entry[0].messaging_events
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, "Text echo: " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs: {access_token, token}
		method: "POST"
		json: {
			receipt: {id: sender},
			message: messageData
		}
	}, (error, response, body) => {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), () => {
	console.log("running: port")
})