import { notFoundError } from './loadErrors';

export default function loadNotFound(context, payload, done) {
    context.executeAction(notFoundError, payload).catch((err) => {done(err);});
    return;
}
