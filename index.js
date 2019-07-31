'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const crawler = require('./crawler');
const helper = require('./messenger_helper');
const leetcode_helper = require('./leetcode_test/leetcode_helper')

const app = express();

app.set('port', (process.env.PORT || 5000));

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// NBA
// function init() {
// 	crawler.init();
// }

// leetcode
var problemSet;
function init() {
	const options = {
        url: "https://leetcode.com/api/problems/all",
        headers: {
            'Connection': 'keep-alive'
        }
    };
    request.get(options, (err, res, body) => {
        if (err) {
            console.log(err);
            return;
        }
        const problemList = JSON.parse(body)['stat_status_pairs'];
        problemSet = leetcode_helper.categorizeProblems(problemList);
    });
    console.log('Done Leetcode init!');
}

// init modules
init();

// ROUTES
app.get('/', async (req, res) => {
	let topNews = await crawler.getTopNews();
	res.send(topNews);
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
			let title = event.postback.title;
			title = title.toLowerCase();
			console.log("postback msg: " + title);
			if (title.includes("nba")) {
				console.log("postback title contains nba");
				crawler.getTopNews().
					then((topNews) => {
						helper.sendGeneric(sender, topNews);
					});
			}
			else if (title == "random easy problems") {
				// random easy problems
				const randomProblem = leetcode_helper.getRandomProblem(problemSet.getEasyProblems());
				helper.sendBottons(sender, randomProblem);
			}
			else if (title == "random medium problems") {
				// random medium problems
				const randomProblem = leetcode_helper.getRandomProblem(problemSet.getMediumProblems());
				helper.sendBottons(sender, randomProblem);
			}
			else if (title == "random hard problems") {
				// random hard problems
				const randomProblem = leetcode_helper.getRandomProblem(problemSet.getHardProblems());
				helper.sendBottons(sender, randomProblem);
			};
		}
		// message post
		else if (event.message && event.message.text) {
			let text = event.message.text;
			text = text.toLowerCase();
			console.log("msg: " + text);
			if (text.includes("nba") || text.includes("news")) {
				console.log("msg contains nba");
				crawler.getTopNews().
					then((topNews) => {
						helper.sendList(sender, topNews);
					});
			} else {
				// Echo text
				helper.sendText(sender, "Echoing: " + text.substring(0, 100));
				// Test button template
				helper.sendBottons(sender);
			};
		};
	}
	res.sendStatus(200);
})

app.listen(app.get('port'), () => {
	console.log("running on port " + app.get('port'));
})