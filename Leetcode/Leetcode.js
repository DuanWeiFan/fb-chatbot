const request = require('request');
const leetcode_helper = require('./leetcode_helper.js');

class Leetcode {
    constructor() {
        const problemSet = getAllProblems();
        this.easyProblems = problemSet["easyProblems"];
        this.mediumProblems = problemSet["mediumProblems"];
        this.hardProblems = problemSet["hardProblems"];
    }

    getRandomProblem(title) {
        var randomProblem;
        switch (title) {
            case "random easy problems":
            randomProblem = leetcode_helper.getRandomProblem(this.easyProblems);
            break;
            
            case "random medium problems":
            randomProblem = leetcode_helper.getRandomProblem(this.mediumProblems);
            break;
            
            case "random hard problems":
            randomProblem = leetcode_helper.getRandomProblem(this.hardProblems);
            break;

            default:
            break;
        }
    };

}

function getAllProblems() {
    var problemSet;
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
    return problemSet;
}

module.exports = Leetcode;