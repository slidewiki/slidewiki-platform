import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'questions',
    read: (req, resource, params, config, callback) => {
        console.log(resource, params);
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid, 'stype': args.stype};

        if (resource === 'questions.count') {
            let randomNumber = Math.round(Math.random() * 20);
            callback(null, {'count' : randomNumber, 'selector': selector, 'mode': args.mode});
        }

        if(resource === 'questions.list') {
            rp.get({
                uri: Microservices.questions.uri + '/' + args.stype + '/' + args.sid + '/' + 'questions',
            }).then((res) => {
                console.log('Questions get should be successful. Check via swagger for following object and id:', args.stype, args.sid);
                console.log(res);
                callback(null, {});
            }).catch((err) => {
                console.log('Questions get errored. Check via swagger for following object and id:', args.stype, args.sid);
                console.log(err);
                callback(err, {});
            });
        }

        /* Hard coded sample work follows */
        /*
            let questions = [
                {id: 12, title: 'Super exciting question', username: 'Ilya B.', userID: 66, difficulty: 2, Date: 'yesterday',
                    answers: [{answer: 'Yes', correct: true, explanation: 'Obvious'},
                            {answer: 'No', correct: false, explanation: ''},
                            {answer: 'May be', correct: true, explanation: 'May the power comes with you!'},
                            {answer: 'I do not know', correct: false, explanation: ''}]},
                {id: 23, title: 'Title for question 2', username: 'Vuk M.', userID: 7, difficulty: 1, Date: '2 hours agp',
                    answers: [{answer: 'Answer 1', correct: false, explanation: 'Some explanation'},
                            {answer: 'Answer 2', correct: false, explanation: ''},
                            {answer: 'Correct answer', correct: true, explanation: ''}]},
                {id: 40, title: 'Very difficult question', username: 'Ali K', userID: 23, difficulty: 3, Date: '23 minutes ago',
                    answers: [{answer: 'Meh...', correct: false, explanation: ''},
                            {answer: 'Make a smart look during the answering...', correct: true, explanation: 'Be simple'}]},
                {id: 22, title: 'Extriemly hard to answer', username: 'Ali K', userID: 23, difficulty: 3, Date: 'yesterday',
                    answers: [{answer: 'Have no idea', correct: false, explanation: ''},
                            {answer: 'The correct one', correct: true, explanation: ''},
                            {answer: 'Also correct', correct: true, explanation: ''}]},
                {id: 16, title: 'The easiest one for everyone!', username: 'Ilya B.', userID: 66, difficulty: 1, Date: '2 minutes ago',
                    answers: [{answer: 'True', correct: true, explanation: ''},
                            {answer: 'False', correct: false, explanation: ''}]},
                {id: 1, title: 'Second Super exciting question', username: 'Ilya B.', userID: 66, difficulty: 2, Date: 'yesterday',
                    answers: [{answer: 'Yes', correct: true, explanation: 'Obvious'},
                                        {answer: 'No', correct: false, explanation: ''},
                                        {answer: 'May be', correct: true, explanation: 'May the power comes with you!'},
                                        {answer: 'I do not know', correct: false, explanation: ''}]},
                {id: 2, title: 'Title for question 2. Some more stuff', username: 'Vuk M.', userID: 7, difficulty: 1, Date: '2 hours agp',
                    answers: [{answer: 'Answer 1', correct: false, explanation: 'Some explanation'},
                                        {answer: 'Answer 2', correct: false, explanation: ''},
                                        {answer: 'Correct answer', correct: true, explanation: ''}]},
                {id: 3, title: 'Very difficult question 2', username: 'Ali K', userID: 23, difficulty: 3, Date: '23 minutes ago',
                    answers: [{answer: 'Meh...', correct: false, explanation: ''},
                                        {answer: 'Make a smart look during the answering...', correct: true, explanation: 'Be simple'}]},
                {id: 4, title: 'Extriemly hard to answer 2', username: 'Ali K', userID: 23, difficulty: 3, Date: 'yesterday',
                    answers: [{answer: 'Have no idea', correct: false, explanation: ''},
                                        {answer: 'The correct one', correct: true, explanation: ''},
                                        {answer: 'Also correct', correct: true, explanation: ''}]},
                {id: 5, title: 'The easiest one for everyone! 2', username: 'Ilya B.', userID: 66, difficulty: 1, Date: '2 minutes ago',
                    answers: [{answer: 'True', correct: true, explanation: ''},
                                        {answer: 'False', correct: false, explanation: ''}]},
                {id: 6, title: 'The easiest one for everyone! 3', username: 'Ilya B.', userID: 66, difficulty: 1, Date: '2 minutes ago',
                    answers: [{answer: 'True', correct: true, explanation: ''},
                                        {answer: 'False', correct: false, explanation: ''}]}
            ];

            let length = questions.length;
            let lowerBound = (args.pageNum - 1) * args.maxQ;
            let upperBound = lowerBound + args.maxQ;
            if (upperBound > length){
                upperBound = length;
            }

            questions = questions.slice(lowerBound, upperBound);
            callback(null, {questions: questions, totalLength: length, selector: selector});
        }
    },
    */
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'questions.add') {
            rp.post({
                uri: Microservices.questions.uri + '/question',
                body:JSON.stringify({
                    user_id: args.userId,
                    related_object_id: args.sid,
                    related_object: args.stype,
                    difficulty: args.difficulty,
                    choices: args.choices,
                    question: args.question})
            }).then((res) => {
                console.log('Question create method should be successful. Check via swagger for following oid, otype, and qid:', args.sid, args.stype, args.questionId);
                callback(null, {});
            }).catch((err) => {
                console.log('Question create method errored. Check via swagger for following oid and qid:', args.sid, args.questionId);
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
            rp.put({
                uri: Microservices.questions.uri + '/question/' + args.questionId,
                body:JSON.stringify({
                    user_id: args.userId,
                    related_object_id: args.sid,
                    related_object: args.stype,
                    difficulty: args.difficulty,
                    choices: args.choices,
                    question: args.question})
            }).then((res) => {
                console.log('Question update should be successful. Check via swagger for questionId:', args.questionId);
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
                callback(null, {});
            }).catch((err) => {
                console.log(err);
                callback(err, {});
            });
        }
    },
};
