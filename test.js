const req = require('request')
req.post('https://leetcode.com/graphql', {
    json: {
        variables: {titleSlug: 'two-sum'},
        query: `query getQuestionDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                questionId
                questionTitle
            }
        }`
    }
}, (error, res, body) => {
    if (error) {
        console.log(error);
        return
    }
    console.log(`statusCode: ${res.statusCode}`);
    console.log(body);
})