const supportedCodes = {
    '0'  : 'Preschool',
    '1'  : 'Primary education',
    '2'  : 'Lower secondary education',
    '3'  : 'Upper secondary education',
    '55' : 'Vocational education',
    '6'  : 'Bachelor\'s / undergraduate',
    '7'  : 'Masters / postgraduate',
    '8'  : 'Doctoral',
    '9'  : 'Other',
    '98' : 'Easy Read', // not part of spec
};

export default {

    educationLevels: supportedCodes,

    getEducationLevel: function(code) {
        let levelName = supportedCodes[code];

        // if not found try to match against prefix
        while (code && !levelName) {
            code = code.slice(0, -1);
            levelName = supportedCodes[code];
        }

        return levelName || 'Unknown';
    },

};
