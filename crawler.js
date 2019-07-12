const rp = require('request-promise');
const cheerio = require('cheerio');

// const url = 'https://www.reddit.com/r/nba/comments/cc3oa9/wojnarowski_the_oklahoma_city_thunder_have_agreed/'

module.exports = {
	getTopNews: 
		function (domain, url) {
			return new Promise((resolve, reject) => {
				let array = new Array();
				rp(domain+url)
				  .then((html) => {
					// let arr = new Array();  	
				  	const $ = cheerio.load(html);

				  	$('h3').each((i, elem) => {
				  		const title = $(elem).text();
				  		const href = domain + $(elem).parent().parent().attr('href');
				  		array.push({title: title, href: href});
				  		// console.log('title: ' + $(elem).text());
				  		// console.log('href: ' + domain + $(elem).parent().parent().attr('href'))
				  	})
				  })
				  .then(() => {
				  	console.log("Done");
				  	resolve(array);
				  	// return array;
				  })
				  .catch((err) => {
				  	console.log(err);
				  });
			})
		}
}


// async function main() {
// 	const domain = 'https://www.reddit.com';
// 	const url = '/r/nba/';
// 	let topNews = await getTopNews(domain, url);
// 	console.log(topNews);
// }

// main();