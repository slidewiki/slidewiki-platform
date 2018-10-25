import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'questions',
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};

        if(resource === 'questions.list') {
            
            rp.get({
                uri: Microservices.questions.uri + '/' + args.stype + '/' + args.sid.split('-')[0] + '/' + 'questions?include_subdecks_and_slides=true',
            }).then((res) => {

                let questions = JSON.parse(res).map((item, index) => {
                    return {
                        id: item.id, title: item.question, difficulty: item.difficulty, relatedObject: item.related_object, relatedObjectId: item.related_object_id, relatedObjectName: item.related_object_name, isExamQuestion: item.is_exam_question,
                        answers: item.choices
                            .map((ans, ansIndex) => {
                                return {answer: ans.choice, correct: ans.is_correct};
                            }),
                        explanation: item.explanation,
                        userId: item.user_id,
                    };
                });
                callback(null, {questions: questions, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        } else if(resource === 'questions.examlist') {
            rp.get({
                uri: Microservices.questions.uri + '/' + args.stype + '/' + args.sid.split('-')[0] + '/' + 'questions?include_subdecks_and_slides=true&exam_questions_only=true'
            }).then((res) => {
                let questions = JSON.parse(res).map((item, index) => {
                    return {
                        id: item.id, title: item.question, difficulty: item.difficulty, relatedObject: item.related_object, relatedObjectId: item.related_object_id, relatedObjectName: item.related_object_name, isExamQuestion: item.is_exam_question,
                        answers: item.choices
                            .map((ans, ansIndex) => {
                                return {answer: ans.choice, correct: ans.is_correct};
                            }),
                        explanation: item.explanation,
                        userId: item.user_id,
                    };
                });
                callback(null, {questions: questions, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        } else if(resource === 'questions.count') {
            const nonExamQuestionsOnly = (args.nonExamQuestionsOnly) ? '&non_exam_questions_only=true' : '';
          
            rp.get({
                uri: Microservices.questions.uri + '/' + args.stype + '/' + args.sid.split('-')[0] + '/' + 'questions?metaonly=true&include_subdecks_and_slides=true' + nonExamQuestionsOnly,
            }).then((res) => {
                callback(null, {count: JSON.parse(res).count});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;

        let choices = [];
        if (args.question.answer1 !== '') {
            choices.push({'choice': args.question.answer1, 'is_correct': args.question.correct1});
        }
        if (args.question.answer2 !== '') {
            choices.push({'choice': args.question.answer2, 'is_correct': args.question.correct2});
        }
        if (args.question.answer3 !== '') {
            choices.push({'choice': args.question.answer3, 'is_correct': args.question.correct3});
        }
        if (args.question.answer4 !== '') {
            choices.push({'choice': args.question.answer4, 'is_correct': args.question.correct4});
        }

        if (resource === 'questions.add') {
            rp.post({
                uri: Microservices.questions.uri + '/' + args.question.relatedObject + '/question',
                body:JSON.stringify({
                    user_id: args.question.userId.toString(),
                    related_object_id: args.question.relatedObjectId.split('-')[0],
                    //related_object: args.question.relatedObject,
                    difficulty: parseInt(args.question.difficulty),
                    choices: choices,
                    question: args.question.title,
                    explanation: args.question.explanation,
                    is_exam_question: args.question.isExamQuestion})
            }).then((res) => {
                let question = JSON.parse(res);
                const answers = question.choices
                    .map((ans, ansIndex) => {
                        return {answer: ans.choice, correct: ans.is_correct};
                    });
                callback(null, {question: {
                    id: question.id, title: question.question, difficulty: question.difficulty, relatedObject: question.related_object, relatedObjectId: question.related_object_id, isExamQuestion: question.is_exam_question,
                    answers: answers,
                    explanation: question.explanation,
                    userId: question.user_id
                }});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }

    },

    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'questions.update') {
            let choices = [];
            let answers = [];//There is a problem with different names used on the platform and service
            if (args.question.answer1 !== '') {
                choices.push({'choice': args.question.answer1, 'is_correct': args.question.correct1});
                answers.push({'answer': args.question.answer1, 'correct': args.question.correct1});
            }
            if (args.question.answer2 !== '') {
                choices.push({'choice': args.question.answer2, 'is_correct': args.question.correct2});
                answers.push({'answer': args.question.answer2, 'correct': args.question.correct2});
            }
            if (args.question.answer3 !== '') {
                choices.push({'choice': args.question.answer3, 'is_correct': args.question.correct3});
                answers.push({'answer': args.question.answer3, 'correct': args.question.correct3});
            }
            if (args.question.answer4 !== '') {
                choices.push({'choice': args.question.answer4, 'is_correct': args.question.correct4});
                answers.push({'answer': args.question.answer4, 'correct': args.question.correct4});
            }

            rp.put({
                uri: Microservices.questions.uri + '/question/' + args.question.qid,
                body:JSON.stringify({
                    user_id: args.question.userId.toString(),
                    related_object_id: args.question.relatedObjectId.split('-')[0],
                    related_object: args.question.relatedObject,
                    difficulty: parseInt(args.question.difficulty),
                    choices: choices,
                    question: args.question.title,
                    explanation: args.question.explanation,
                    is_exam_question: args.question.isExamQuestion
                })
            }).then((res) => {
                const question = {
                    id: args.question.qid, title: args.question.title, difficulty: parseInt(args.question.difficulty), relatedObject: args.question.relatedObject, relatedObjectId: args.question.relatedObjectId.split('-')[0], isExamQuestion: args.question.isExamQuestion,
                    answers: answers,
                    explanation: args.question.explanation,
                    userId: args.question.userId.toString()
                };
                callback(null, {question: question});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        } else if (resource === 'questions.updateExamList') {
            rp.put({
                uri: Microservices.questions.uri + '/questions/updateExamList',
                body: JSON.stringify(args.modifiedSelections)
            }).then(() => {
                callback(null, {});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }
    },

    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'questions.delete') {
            rp.delete({
                uri: Microservices.questions.uri + '/question/' + args.questionId
            }).then((res) => {
                console.log('Question delete should be successful. Check via swagger for questionId:', args.questionId);
                callback(null, {questionId: args.questionId});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }
    },
};
