'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const crawler = require('./crawler')

const app = express()

let token = "EAAFihsSyj70BAIS1FZBcTKXcBB2BRZAMaU01JteEaSV6Hqu4ySHtvH7c1zEdokCW0645lw8ex5AcpGmd2aZCsxm2ZB6VZAgXMZCPfjxT6RMerraU9iHGe2Ljy6hIgVZBEIV1lnmIOY8XmmZApRqdgzvKMoO5kpTCfydGMnYjiooNhwZDZD"

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


let topNews
let lastUpdateTime = new Date();
// ROUTES

app.get('/', async (req, res) => {
	// res.send("Hi I'm a chatbot")
	let currTime = new Date();
	const domain = 'https://www.reddit.com'
	const url = '/r/nba/'
	let timeDiff = Math.round((currTime - lastUpdateTime) / 1000 ) // seconds
	if (typeof topNews == "undefined" || timeDiff > 10) {
		topNews = await crawler.getTopNews(domain, url)	
		lastUpdateTime = new Date();
	}
	res.send(topNews)
	// res.send(topNews)
})

// Facebook

app.get('/webhook/', (req, res) => {
	if (req.query['hub.verify_token'] === "chatbot") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.post('/webhook/', (req, res) => {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, "Echoing: " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs: {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
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
	console.log("running on port " + app.get('port'))
})