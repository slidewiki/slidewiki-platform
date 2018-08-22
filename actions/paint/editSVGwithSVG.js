const log = require('../log/clog');

export default function editSVGwithSVG(context, svg, done) {
    log.info(context);
    let params = {
        svg: svg,
        title: null,
        altText: null,
        url: null
    };
    context.dispatch('OPEN_WITH_SRC', params);
}
