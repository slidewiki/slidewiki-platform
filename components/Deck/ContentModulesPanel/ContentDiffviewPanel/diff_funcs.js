import createElement from 'virtual-dom/create-element';
import VNode from 'virtual-dom/vnode/vnode';
import VText from 'virtual-dom/vnode/vtext';
const convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});
import $ from 'jquery';
import _ from 'lodash';
import * as jsdiff from 'diff';

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
// Color + | Size ? | Font ? | Decoration ?
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

    let elem = createElement(el.patch);
    $(elem).addClass('added');
    let root = createElement(convertHTML(source));
    $(root).append(elem);
    source = root.outerHTML;

    return source;
};

const handleREMOVE = (el, source) => {

    const tag = el.vNode.tagName;
    const textArray = deepSearch(el.vNode, 'text');
    const text = textArray[0].text;
    let root = createElement(convertHTML(source));
    $(root).find(`${tag}:contains('${text}')`).addClass('deleted');
    source = root.outerHTML;

    return source;
};

const handlePROPS = (node, patch, source) => {
    console.warn('PROPS');

    const tag = node.tagName;

    let styles = patch.style;
    if(styles) Object.keys(styles).forEach((key) => styles[key] === undefined ? delete styles[key] : '');
    let attrs = patch.attributes;
    if(attrs) Object.keys(attrs).forEach((key) => attrs[key] === undefined ? delete attrs[key] : '');


    let change = (_.isEmpty(styles)) ? attrs : styles;
    let key = Object.keys(change)[0];
    let vals = Object.values(change)[0];
    // console.log(`Patch obj: ${change}, Key: ${key}, Value: ${vals}`);

    let root = createElement(convertHTML(source));

    //TODO. UPDATE SEARCH. TEXT ONLY FINDS IF FIRST CHILD AND NOT DEEPLY NESTED. BY ID IS GOOD
    if (key && vals) {
        const textArray = deepSearch(node, 'text');
        const text = textArray[0].text;
        const _id = node.properties.attributes._id;

        if (_id) {
            let targetElement = $(root).find(`${tag}[_id='${_id}']`);
            targetElement.addClass('modified');
        } else if (tag) {
            //[Problem] if node tags are changed. span -> h2
            let targetElement = $(root).find(`${tag}:contains('${text}')`);
            targetElement.addClass('modified');
            //TODO add attributes to the node
            //[QA] use old styles or apply new styles ?
            // targetElement.css(`${key}`, `${vals}`);
        }
    }
    /*else if (patch === 'attributes') {
        node.properties[`${change}`][`${key}`] = vals;
        //$(root).find(`${tag}.${vals}`).addClass('modified');
    }*/
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
                if(type === 'VirtualText') initSrc = handleTEXT(el.vNode, el.patch.children[0], initSrc);
                if(type === 'VirtualNode') initSrc = handlePROPS(el.patch, el.patch.properties, initSrc);
                break;
            case 3:
                console.warn('WIDGET');
                elem = createElement(el.vNode);
                break;
            case 4:
                initSrc = handlePROPS(el.vNode, el.patch, initSrc);
                break;
            case 5:
                console.warn('ORDER');
                elem = createElement(el.patch);
                break;
            case 6:
                console.warn('INSERTED');
                initSrc = handleINSERT(el, initSrc);
                break;
            case 7:
                console.warn('REMOVE');
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
