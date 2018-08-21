import rp from 'request-promise';

import {Microservices} from '../../configs/microservices';
import {isEmpty, assignToAllById} from '../../common';

// promises user public info for a list of user ids
function fetchUserInfo(userIds) {
    // return empty list if nothing provided
    if (isEmpty(userIds)) {
        return Promise.resolve([]);
    }

    return rp.post({
        uri: `${Microservices.user.uri}/users`,
        json: true,
        body: userIds,
    }).then((users) => users.map((u) => Object.assign({id: u._id}, u)));
}

// promises group public info for a list of group ids (not the users in the groups)
function fetchGroupInfo(groupIds) {
    // return empty list if nothing provided
    if (isEmpty(groupIds)) {
        return Promise.resolve([]);
    }

    return rp.post({
        uri: `${Microservices.user.uri}/usergroups`,
        json: true,
        body: groupIds,
    }).then((groups) => groups.map((g) => ({id: g.id, name: g.name}) ));
}

export default {
    fillInUserInfo(users, idParam='id') {
        return fetchUserInfo(users.map((e) => e[idParam]))
        .then((userInfo) => assignToAllById(users, userInfo));
    },

    fillInGroupInfo(groups, idParam='id') {
        return fetchGroupInfo(groups.map((e) => e[idParam]))
        .then((groupIno) => assignToAllById(groups, groupIno));
    },
};
