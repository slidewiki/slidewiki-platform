import {BaseStore} from 'fluxible/addons';

class ContentQuestionsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.questions = [];
        this.question = null;
        this.selector = {};
        this.questionsCount = 0;
        this.showAddBox = false;
    }
    addQuestion(payload) {
        this.questions.push(payload.question);
        this.showAddBox = false;
        this.emitChange();
    }
    updateQuestion(payload) {
        // let updatedQuestion = this.questions.find((qst) => qst.id === payload.question.id);
        this.question.title = payload.question.title;
        this.question.difficulty = payload.question.difficulty;
        this.question.answers = payload.question.answers;
        this.question.explanation = payload.question.explanation;
        this.question = null;

        this.emitChange();
    }
    deleteQuestion(payload) {
        let index = this.questions.findIndex((qst) => {return (qst.id === payload.questionId);});
        if (index !== -1) {
            this.questions.splice(index, 1);
        }
        this.question = null;
        this.emitChange();
    }
    loadQuestions(payload) {
        this.questions = payload.questions;
        this.question = null;
        this.selector = payload.selector;
        this.questionsCount = this.questions.length;
        this.emitChange();
    }
    loadQuestion(payload) {
        this.question = this.questions.find((qst) => qst.id === payload.qstid);
        this.emitChange();
    }
    cancelQuestion(payload) {
        this.question = null;
        this.emitChange();
    }
    toggleAnswers(payload) {
        this.question = this.questions.find((qst) => qst.id === payload.qstid);
        let question = payload.question;
        if (question.answersShown) {
            question.answersShown = false;
        }
        else {
            question.answersShown = true;
        }
        this.emitChange();
    }
    invertAddBoxFlag() {
        this.showAddBox = !this.showAddBox;
        this.emitChange();
    }
    getState() {
        return {
            questions: this.questions,
            question: this.question,
            selector: this.selector,
            questionsCount: this.questionsCount,
            showAddBox: this.showAddBox
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.questions = state.questions;
        this.question = state.question;
        this.selector = state.selector;
        this.questionsCount = state.questionsCount;
        this.showAddBox = state.showAddBox;
    }
}

ContentQuestionsStore.storeName = 'ContentQuestionsStore';
ContentQuestionsStore.handlers = {
    'LOAD_CONTENT_QUESTIONS_SUCCESS': 'loadQuestions',
    'LOAD_QUESTION': 'loadQuestion',
    'CANCEL_QUESTION': 'cancelQuestion',
    'TOGGLE_ANSWERS': 'toggleAnswers',
    'UPDATE_QUESTION': 'updateQuestion',
    'ADD_QUESTION': 'addQuestion',
    'DELETE_QUESTION': 'deleteQuestion',
    'INVERT_ADD_QUESTION_BOX_FLAG': 'invertAddBoxFlag'
};

export default ContentQuestionsStore;
