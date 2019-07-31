'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./messenger_helper.js');
const Leetcode = require('./Leetcode/Leetcode.js')

const app = express();

app.set('port', (process.env.PORT || 5000));

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// leetcode
var leetcodeClient;
function init() {
	leetcodeClient = new Leetcode();
    console.log('Done Leetcode init!');
}

// init modules
init();

// ROUTES
app.get('/', async (req, res) => {
	res.send("Success!");
})

// Facebook
app.get('/webhook/', (req, res) => {
	if (req.query['hub.verify_token'] === "chatbot") {
		res.send(req.query['hub.challenge']);
	}
	res.send("Wrong Token");
})

app.post('/webhook/', (req, res) => {
	console.log(req.body.entry[0]);
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i];
		let sender = event.sender.id;
		// postback
		if (event.postback && event.postback.title) {
			console.log("postback event: ");
			console.log(event.postback);
			const title = event.postback.title;
			const payload = event.postback.payload;
			switch (payload) {
				case "Leetcode":
				const randomProblem = leetcodeClient.getRandomProblem(title);
				helper.sendBottons(sender, randomProblem);
				break;
			}
		}
		// message post
		else if (event.message && event.message.text) {
			let text = event.message.text;
			text = text.toLowerCase();
			console.log("msg: " + text);
			if (text.includes("Leetcode")) {
				// quick replies
				helper.sendQuickReplies(sender);
			}
		};
	}
	res.sendStatus(200);
})

app.listen(app.get('port'), () => {
	console.log("running on port " + app.get('port'));
})