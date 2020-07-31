import log from './log/clog';
import { shortTitle } from '../configs/general';

export default function setDocumentTitle(context,payload){
    log.info(context);

    context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: shortTitle + ' | ' + payload.title });
}
