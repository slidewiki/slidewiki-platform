import {navigateAction} from 'fluxible-router';

export default function handleRevisionChangesAndNavigate(context, payload) {
    let selector = {
        id: payload.selector.id,
        stype: payload.selector.stype,
        sid: payload.selector.sid,
        spath: payload.selector.spath
    };
    let changeset = payload.changeset;
    if (changeset != null) {
        let pathArr = selector.spath.split(';');
        let j = 0;
        if (changeset.new_revisions[0].root_changed != null) {
            j = 1;
            selector.id = changeset.new_revisions[0].root_changed;
        }
        for (let i = 0; i < pathArr.length; i++) {
            let pathNodeId = pathArr[i].split(':')[0].split('-')[0];
            if (j < changeset.new_revisions.length && pathNodeId === changeset.new_revisions[j].split('-')[0]) {
                pathArr[i] = pathNodeId + '-' + changeset.new_revisions[j].split('-')[1] + ':' + pathArr[i].split(':')[1];
                j++;
            }
        }
        selector.spath = pathArr.join(';');
    }

    //update the URL
    let newURL = '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath;
    if (payload.mode != null) {
        newURL += '/' + payload.mode;
    }
    //navigate to new url and force deck tree refetch in case of revisioning changes
    context.executeAction(navigateAction, {
        url: newURL,
        runFetchTree: changeset != null
    });
}
