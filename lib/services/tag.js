import rp from 'request-promise';

import {Microservices} from '../../configs/microservices';
import {isEmpty, assignToAllById} from '../../common';

export default {

    // fetches the tags data
    fetchTagInfo(tags) {
        if (isEmpty(tags)) return Promise.resolve([]);

        return rp.get({
            uri: `${Microservices.tag.uri}/tags`,
            qs: {
                tagType: 'all',
                tagName: tags.map((t) => t.tagName),
                paging: false, // this allows for unpaged results
            },
            useQuerystring: true,
            json: true,
        });
    },

};
