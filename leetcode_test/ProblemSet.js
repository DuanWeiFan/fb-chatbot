class ProblemSet{
    constructor() {
        this.easyProblems = [];
        this.mediumProblems = [];
        this.hardProblems = [];
    }
    getEasyProblems() {
        return this.easyProblems;
    }
    getMediumProblems() {
        return this.mediumProblems;
    }
    getHardProblems() {
        return this.hardProblems;
    }
};
module.exports = ProblemSet;