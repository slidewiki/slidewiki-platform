export default {
    AllowedPattern: {
        DECK_ID: /^([0-9]+|[0-9]+-[0-9]+)$/, // allows 2, 23, 23-32 but not 23- or 23-32-32 etc.
        SLIDE_ID: /^[0-9a-zA-Z-]+$/,
        DECK_CONTENT_PATH: /^[0-9a-z:;-]+$/
    }
};
