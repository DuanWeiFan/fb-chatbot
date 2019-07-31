const request = require('sync-request');
const leetcode_helper = require('./leetcode_helper.js');

class Leetcode {
    constructor() {
        const problemSet = getAllProblemsAndCategorize();
        this.easyProblems = problemSet["easyProblems"];
        this.mediumProblems = problemSet["mediumProblems"];
        this.hardProblems = problemSet["hardProblems"];
    }

    getRandomProblem(title) {
        var randomProblem;
        if (title.includes("easy")) {
            randomProblem = leetcode_helper.getRandomProblem(this.easyProblems);
        }
        else if (title.includes("medium")) {
            randomProblem = leetcode_helper.getRandomProblem(this.mediumProblems);
        }
        else if (title.includes("hard")) {
            randomProblem = leetcode_helper.getRandomProblem(this.hardProblems);
        }
        return randomProblem;
    };

}

function getAllProblemsAndCategorize() {
    var res = request('GET', "https://leetcode.com/api/problems/all", {
        headers: {
            "Connection": "keep-alive"
        }
    })
    var problemList = JSON.parse(res.getBody());
    problemList = problemList['stat_status_pairs'];
    return leetcode_helper.categorizeProblems(problemList);
}

module.exports = Leetcode;