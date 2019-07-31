const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const helper = require('./leetcode_helper');
const ProblemSet = require('./ProblemSet.js');
const app = express();

app.set('port', (process.env.PORT || 5000));

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var problemSet;
// init
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
        problemList = JSON.parse(body)['stat_status_pairs'];
        problemSet = helper.categorizeProblems(problemList);
    });
    console.log('Done init!');
};

init();

// random problem
app.get('/random/:level', (req, res)  => {
    const level = req.params['level'].toLowerCase();
    var RandomProblem;
    switch(level) {
        case "easy":
        RandomProblem = helper.getRandomProblem(problemSet.getEasyProblems());
        break;

        case "medium":
        RandomProblem = helper.getRandomProblem(problemSet.getMediumProblems());
        break;

        case "hard":
        RandomProblem = helper.getRandomProblem(problemSet.getHardProblems());
        break;

        default:
        console.log("Unsupported Level:" + level);
        res.sendStatus(404);
    }
    res.end(`https://leetcode.com/problems/${RandomProblem.getTitleSlug()}`);
    // res.end(JSON.stringify(randomProblem));
});

app.listen(app.get('port'), () => {
	console.log("running on port " + app.get('port'));
})
