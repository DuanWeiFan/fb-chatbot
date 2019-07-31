var exports = module.exports = {};
const request = require('request');
const ProblemSet = require('./ProblemSet.js');
const Problem = require('./Problem.js');

exports.categorizeProblems = (problemList) => {
    var problemSet = new ProblemSet();
    for (i = 0; i < problemList.length; i++) {
        problem = problemList[i];
        if (isPaidOnlyProblem(problem))
            continue;
        switch (problem["difficulty"]["level"]) {
            case 1:
            problemSet.easyProblems.push(new Problem(problem));
            break;
            
            case 2:
            problemSet.mediumProblems.push(new Problem(problem));
            break;

            case 3:
            problemSet.hardProblems.push(new Problem(problem));
            break;
        }
    }
    return problemSet;
};

function isPaidOnlyProblem(problem) {
    if (problem['paid_only'] == true)
        return true;
    return false;
};

exports.getRandomProblem = (problems) => {
    const size = problems.length;
    randomProblem = problems[getRandomInt(size)];
    // getProblemDetail(randomProblem);
    return randomProblem;
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

function getProblemDetail (problem) {
    request.post('https://leetcode.com/graphql', {
        json: {
            variables: {titleSlug: problem.getTitleSlug()},
            query: `query getQuestionDetail($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                    questionId
                    questionTitle
                    content
                }
            }`
        }
    }, (error, res, body) => {
        if (error) {
            console.log(error);
            return
        }
        var content = body['data']['question']['content'];
        var parsedContent = content.replace(/<[^>]*>?/gm, '');
        parsedContent = decodeHTMLEntities(parsedContent);
        console.log(`statusCode: ${res.statusCode}`);
        console.log(content);
        console.log('ParsedContent_________');
        console.log(parsedContent);
    })
};

function decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
}