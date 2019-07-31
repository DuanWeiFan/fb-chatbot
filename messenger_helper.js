
const request = require('request');

// get FB ACCESS_TOKEN from environment variable
const token = process.env.ACCESS_TOKEN;

// export modules
var exports = module.exports = {};


const sendRequest = (sender, messageData) => {
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
            console.log("sending error");
            console.log(error);
		} else if (response.body.error) {
            console.log("response body error");
            console.log(response.body.error);
		}
	})
};


exports.sendText = (sender, text) => {
    let messageData = {text: text};
    sendRequest(sender, messageData);
};

exports.sendBottons = (sender, problem) => {
    let messageData = {
        attachment: {
			type: "template",
			payload: {
                template_type: "button",
                text: "#" + problem.getFrontendId() + "." + problem.getTitle(),
				buttons: [
					{
						type: "web_url",
						url: `https://leetcode.com/problems/${problem.getTitleSlug()}`,
						title: "Visit problem"
					}
				]
			}
		}
    };
    sendRequest(sender, messageData);
};

exports.sendGeneric = (sender, topNews) => {
    const maximumViews = 8;
    let elements = new Array();
    for (let i = 0; i < Math.min(topNews.length, maximumViews); i++) {
        let element = {};
        element.title = topNews[i].title;
        element.buttons = [{
            title: "View",
            type: "web_url",
            url: topNews[i].url
        }];
        elements.push(element);
    }
    let messageData = {
        attachment: {
			type: "template",
			payload: {
                template_type: "generic",
                elements: elements
			}
		}
    };
    sendRequest(sender, messageData);
};

exports.sendQuickReplies = (sender) => {
    let messageData = {
        text: "Select Random Problem Level",
        quick_replies: [
            {
                content_type: "text",
                title: "random easy problems",
                payload: "Leetcode"
            },
            {
                content_type: "text",
                title: "random medium problems",
                payload: "Leetcode"
            },
            {
                content_type: "text",
                title: "random hard problems",
                payload: "Leetcode"
            }
        ]
    };
    sendRequest(sender, messageData);
};
