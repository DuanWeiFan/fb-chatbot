'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const crawler = require('./crawler')
const helper = require('./helper')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

function init() {
	crawler.init()
}

// init modules
init()

// ROUTES
app.get('/', async (req, res) => {
	let topNews = await crawler.getTopNews()
	res.send(topNews)
})

// Facebook

app.get('/webhook/', (req, res) => {
	if (req.query['hub.verify_token'] === "chatbot") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.post('/webhook/', async (req, res) => {
	console.log(req.body.entry[0]);
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			text = text.toLowerCase()
			console.log("msg: " + text)
			if (text.includes("nba") || text.includes("news")) {
				console.log("msg contains nba")
				let topNews = await crawler.getTopNews()
				helper.sendList(sender, topNews)
			} else {
				// Echo text
				helper.sendText(sender, "Echoing: " + text.substring(0, 100))
				// Test button template
				helper.sendBottons(sender)
			}
			
		}
	}
	res.sendStatus(200)
})

app.listen(app.get('port'), () => {
	console.log("running on port " + app.get('port'))
})