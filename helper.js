
const request = require('request')

// export modules
var exports = module.exports = {};

let token = "EAAFihsSyj70BAIS1FZBcTKXcBB2BRZAMaU01JteEaSV6Hqu4ySHtvH7c1zEdokCW0645lw8ex5AcpGmd2aZCsxm2ZB6VZAgXMZCPfjxT6RMerraU9iHGe2Ljy6hIgVZBEIV1lnmIOY8XmmZApRqdgzvKMoO5kpTCfydGMnYjiooNhwZDZD"

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
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}


exports.sendText = (sender, text) => {
    let messageData = {text: text}
    sendRequest(sender, messageData);
}

exports.sendBottons = (sender) => {
    let messageData = {
        attachment: {
			type: "template",
			payload: {
				template_type: "button",
				text: "What's up",
				buttons: [
					{
						type: "web_url",
						url: "https://www.google.com",
						title: "Visit Google"
					},
					{
						type: "web_url",
						url: "https://www.amazon.com/",
						title: "Visit Amazon"
					}
				]
			}
		}
    }
    sendRequest(sender, messageData)
}

exports.sendList = (sender, topNews) => {
    const maximumViews = 5;
    let elements = new Array()
    for (let i = 0; i < Math.min(topNews.length, maximumViews); i++) {
        let element = {}
        element.title = topNews.title
        element.buttons = [{
            title: "View",
            type: "web_url",
            url: topNews.url
        }]
        elements.push(element)
    }
    let messageData = {
        attachment: {
			type: "template",
			payload: {
                template_type: "list",
                top_element_style: "compact",
                elements: elements,
                butons: [{
                    title: "View More",
                    type: "postback",
                    payload: "payload"
                }]

			}
		}
    }
    sendRequest(sender, messageData)
}