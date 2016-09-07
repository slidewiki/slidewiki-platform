export default {
    
    isEmpty: function(toTest) {
        return (toTest === undefined ||
            toTest === null ||
            toTest === '' ||
            (toTest instanceof Object && Object.keys(toTest).length === 0) ||
            (toTest instanceof Array && toTest.length === 0));
    }
};
