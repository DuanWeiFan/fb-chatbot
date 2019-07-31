class Problem {
    constructor(problem) {
        this.level = problem['difficulty']['level'];
        this.frontendId = problem['stat']['frontend_question_id'];
        this.problemId = problem['stat']['question_id'];
        this.title = problem['stat']['question__title'];
        this.title_slug = problem['stat']['question__title_slug'];
    }
    getLevel() {
        return this.level;
    }
    getFrontendId() {
        return this.frontendId;
    }
    getProblemId() {
        return this.frontendId;
    }
    getTitle() {
        return this.title;
    }
    getTitleSlug() {
        return this.title_slug;
    }
};

module.exports = Problem;