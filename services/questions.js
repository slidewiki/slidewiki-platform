export default {
    name: 'questions',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid, 'stype': args.stype};

        if (resource === 'questions.count'){

            let randomNumber = Math.round(Math.random() * 20);
            callback(null, {'count' : randomNumber, 'selector': selector, 'mode': args.mode});

        }

        if(resource === 'questions.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
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
                            {answer: 'False', correct: false, explanation: ''}]}
            ];
            callback(null, {questions: questions, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
