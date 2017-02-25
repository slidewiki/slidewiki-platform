import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'tags',
    read: (req, resource, params, config, callback) => {
        const { id } = params;

        switch (resource) {
            case 'tags.slide':
                // TODO: get tags for slide, use parameter destructuring
                callback(null, getTagsForSlide(id));
                break;
            case 'tags.deck':
                callback(null, getTagsForDeck(id));
                break;
        }
    },
    create: (req, resource, params, body, config, callback) => {
        // TODO: implement create
    },
    update: (req, resource, params, body, config, callback) => {
        // TODO: implement update
    },
    delete: (req, resource, params, body, config, callback) => {
        // TODO: implement delete
    }
};

function getTagsForDeck(id) {
    return ['Tag1Deck', 'Tag2Deck'];
}

function getTagsForSlide(id) {
    return ['Tag1Slide', 'Tag2Slide'];
}
