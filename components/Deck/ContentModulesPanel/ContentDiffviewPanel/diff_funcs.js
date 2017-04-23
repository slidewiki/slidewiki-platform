import createElement from 'virtual-dom/create-element';
import VNode from 'virtual-dom/vnode/vnode';
import VText from 'virtual-dom/vnode/vtext';
const convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});
import $ from 'jquery';
import _ from 'lodash';
import * as jsdiff from 'diff'



//TODO FUnction that takes a string and returns a FUnction applying createElement(convertHTML());

const deepSearch = (obj, key) => {
    if (_.has(obj, key)) // or just (key in obj)
        return [obj];
    // elegant:
    // return _.flatten(_.map(obj, function(v) {
    //     return typeof v == "object" ? fn(v, key) : [];
    // }), true);

    // or efficient:
    let res = [];
    _.forEach(obj, (v) => {
        if (typeof v == 'object' && (v = deepSearch(v, key)).length)
            res.push.apply(res, v);
    });
    return res;
};

//TODO ADD HEAVY PROPS CHECK
const handleTEXT = (oldText, newText, source) => {
    console.warn('TEXT');

    const oldStr = oldText.text,
          newStr = newText.text;

    let color = '',
        container = null,
        diff = jsdiff.diffWords(oldStr, newStr),
        temp = document.createElement('div');


    diff.forEach((part) => {
        // green for additions, red for deletions
        // grey for common parts
        color = part.added ? 'ins' : part.removed ? 'del' : '';
        container = document.createElement('span');
        container.className = color;
        container.appendChild(document.createTextNode(part.value));
        temp.appendChild(container);
    });

    const markedText = temp.innerHTML;
    source = source.replace(oldStr, markedText);

    return source;
};

const handleINSERT = (el, source) => {
    console.warn('INSERTED');

    let elem = createElement(el.patch);
    $(elem).addClass('added');
    let root = createElement(convertHTML(source));
    $(root).append(elem);
    source = root.outerHTML;

    return source;
};

const handleREMOVE = (el, source) => {
    console.warn('REMOVE');

    const tag = el.vNode.tagName;
    const textArray = deepSearch(el.vNode, 'text');
    const text = textArray[0].text;
    let root = createElement(convertHTML(source));
    $(root).find(`${tag}:contains('${text}')`).addClass('deleted');
    source = root.outerHTML;

    return source;
};

const handlePROPS = (el, source) => {
    console.warn('PROPS');

    const tag = el.vNode.tagName;
    //TODO Detect not only attrs change, but style [1] as well
    const patchType = Object.keys(el.patch)[0];
    const patch = Object.keys(el.patch[`${patchType}`])[0];
    const vals = Object.values(el.patch[`${patchType}`])[0];

    // console.log(`Patch type: ${patchType}, Patch: ${patch}, Value: ${vals}`);

    // elem = createElement(el.vNode);
    // $(elem).addClass('modified');

    let root = createElement(convertHTML(source));

    //TODO. UPDATE SEARCH. TEXT ONLY FINDS IF FIRST CHILD AND NOT DEEPLY NESTED. BY ID IS GOOD
    if (patchType === 'style' && vals) {
        let text = el.vNode.children[0].text;
        let _id = el.vNode.properties.attributes._id;

        if (_id) {
            let targetElement = $(root).find(`${tag}[_id='${_id}']`);
            targetElement.addClass('modified');
        } else if (tag) {
            let targetElement = $(root).find(`${tag}:contains('${text}')`);
            targetElement.addClass('modified');
            // targetElement.css(`${patch}`, `${vals}`);
        }
    } else if (patchType === 'attributes') {
        el.vNode.properties[`${patchType}`][`${patch}`] = vals;
        //$(root).find(`${tag}.${vals}`).addClass('modified');
    }
    source = root.outerHTML;

    return source;
};

const preprocessSrc = (source, mode) => {

    source = source
                .replace(/&nbsp;/g, ' ')
                .replace(/(?:\r\n|\r|\n)/g, '');

    if (mode) {
        //uploaded slide
        let root = createElement(convertHTML(source));
        $(root).find('.drawing-container').remove();
        $(root).find('span:empty').remove();
        //remove first emply div
        $(root).find('div').first().remove();
        source = root.outerHTML;

    } else {
        //created slide

        //wrap in a root node
        source = `<div class='root'>${source}</div>`;
    }

    return source;
};

const setKeys = (source) => {
    //apply keys for proper change detection
    source = convertHTML({
        getVNodeKey: function(attributes) {
            return attributes.id;
        }
    }, source);

    return source;
};

/**
* @params:
@ PatchObject:list of diff changes
@ string:initSrc - apply changes on top of this source string
@ string:mode: uploaded/created
*/
const detectnPatch = (list, initSrc, mode) => {
    let elem;
    console.group();
    console.info('Changes');
    list.map((el) => {
        switch (el.type) {
            case 0:
                console.warn('NONE');
                break;
            case 1:
                const textArray = deepSearch(el, 'text');
                initSrc = handleTEXT(textArray[0], textArray[1], initSrc);
                break;
            case 2:
                console.warn('VNODE');
                const type = el.vNode.constructor.name;
                if(type === 'VirtualText') initSrc = handleTEXT(el.vNode, el.patch.children[0], initSrc, mode);
                // elem = createElement(el);
                break;
            case 3:
                console.warn('WIDGET');
                elem = createElement(el.vNode);
                break;
            case 4:
                initSrc = handlePROPS(el, initSrc);
                break;
            case 5:
                console.warn('ORDER');
                elem = createElement(el.patch);
                break;
            case 6:
                initSrc = handleINSERT(el, initSrc);
                break;
            case 7:
                initSrc = handleREMOVE(el, initSrc);
                break;
            default:
                console.warn('default');
        }
    });
    console.groupEnd();

    return initSrc;
};

module.exports = {
    preprocess: preprocessSrc,
    construct: detectnPatch,
    setKeys: setKeys
};
