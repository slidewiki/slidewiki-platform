let doNotRepeat = 'Please do not repeat the request without modifications.';
let badRequest = 'Bad Request.';
let error_desc = {
    'DECK_ID_TYPE_INCORRECT': badRequest + 'Deck id must be a positive integer.' + ' ' + doNotRepeat,
    'DECK_CONTENT_TYPE_INCORRECT': badRequest + 'Deck content type can be a deck, a slide or a question.' + ' ' + doNotRepeat,
    'DECK_CONTENT_ID_INCORRECT': badRequest + 'Deck content id must be an alphnumeric string.' + ' ' + doNotRepeat,
    'DECK_CONTENT_PATH_INCORRECT': badRequest + 'Deck tree content path has incorrect syntax.' + ' ' + doNotRepeat,
};
//joi validation library
//checkit validation library
// the validation library
module.exports = exports = error_desc;
