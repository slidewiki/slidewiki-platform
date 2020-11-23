import log from './log/clog';
import { shortTitle } from '../configs/general';
import {isString} from 'lodash';

export default function setDocumentTitle(context, { title }) {
    log.info(context);

    // remove HTML from title
    const cleanTitle =  isString(title) ? title.replace(/<\/?[^>]+(>|$)/g, '').replace(/&#39;/g, '\'').replace(/&#34;/g, '\"') : title;

    context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: shortTitle + ' | ' + cleanTitle });
}
