import notFoundError from './error/notFoundError';

export default function loadNotFound(context, payload, done) {
    context.executeAction(notFoundError, payload, done);
    return;
}
