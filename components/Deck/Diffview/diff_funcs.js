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

//TODO CHECK meta-date changes. Title changes -> result in new revisions
const CKEditor_vars = ['span', 'var', 'em', 'strong', 'u'];

const toHTML = (string) => (
  createElement(convertHTML(string))
);

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

// Fn resposible for comparing 2 root IDs
const compareWrapperIds = (initSrc, finalSrc) => {
    const finalRoot = toHTML(finalSrc);
    const initRoot = toHTML(initSrc);

    return ($(finalRoot)[0].id === $(initRoot)[0].id) ? true : false;
};

const getParentId = (finalSrc, id) => {
    const finalRoot = toHTML(finalSrc);
    const parent = $(finalRoot).find(`#${id}`).parent();

    return parent[0].id;
};

const getClosestDiv = (finalSrc, id) => {
    const finalRoot = toHTML(finalSrc);
    const parent = $(finalRoot).find(`#${id}`).closest('div');

    return parent[0].id;
};

const handleTEXT = (oldText, newText, source) => {

    const oldStr = oldText.text,
        newStr = newText.text;
    let root = toHTML(source);

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

    $(root).find(`*:contains(${oldStr})`)
            .filter(function() { return $(this).text() === oldStr; })
            .html(markedText);

    source = root.outerHTML;

    return source;
};

const handleINSERT = (el, source, finalsource) => {
    const elem = createElement(el.patch);
    const _id = el.patch.key;
    const tag = el.patch.tagName;
    let root = toHTML(source);

    if(_.includes(CKEditor_vars, tag)) {
        let parent = getClosestDiv(finalsource, _id);
        $(root).find(`#${parent}`).addClass('modified');
    } else {
        let targetElement = $(elem);
        targetElement.addClass('added');

        let parent = getParentId(finalsource, _id);
        $(root).prop('id') === parent ?
          $(root).append(elem) : $(root).find(`#${parent}`).append(elem);
    }

    source = root.outerHTML;

    return source;
};

const handleREMOVE = (el, source, finalsource) => {
    const _id = el.vNode.key;
    const tag = el.vNode.tagName;
    let root = toHTML(source);

    if(_.includes(CKEditor_vars, tag)) {
        let parent = getClosestDiv(finalsource, _id);
        $(root).find(`#${parent}`).addClass('modified');
    } else {
        if(_id){
            let targetElement = $(root).find(`#${_id}`);
            targetElement.addClass('deleted');
        }
    }

    source = root.outerHTML;

    return source;
};

const handlePROPS = (node, patch, source, finalsource, vnode) => {
    const _id = node.key;
    const tag = node.tagName;
    let root = toHTML(source);

    let styles = patch.style;
    if(styles) Object.keys(styles).forEach((key) => styles[key] === undefined ? delete styles[key] : '');
    let attrs = patch.attributes;
    if(attrs) Object.keys(attrs).forEach((key) => attrs[key] === undefined ? delete attrs[key] : '');

    let change = (_.isEmpty(styles)) ? attrs : styles;
    let key = Object.keys(change)[0];
    let vals = Object.values(change)[0];

    if (key && vals) {
        if (_id) {
            //[Problem] if node tags are changed. span -> h2
            // let targetElement = $(root).find(`${tag}[_id='${_id}']`);
            let targetElement;
            if(!vnode){
                targetElement = $(root).find(`#${_id}`);
            } else {
                let parent = getParentId(finalsource, _id);
                targetElement = $(root).find(`#${parent}`);
            }
            targetElement.addClass('modified');
            targetElement.css(`${key}`, `${vals}`);
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
                .replace(/&nbsp;/g, '')
                .replace(/(?:\r\n|\r|\n)/g, '')
                .replace(/&#8203;/g, '');

    if (mode) {
        //canvas slide
        const vTreeObject = convertHTML(source);
        let root;

        vTreeObject.length > 1 ? root = createElement(vTreeObject[0]) : root = createElement(vTreeObject);

        $(root).find('br').remove();
        $(root).find('.drawing-container').remove();
        $(root).find('p:empty').remove();
        $(root).find('span:empty').remove();
        $(root).find('div:empty').remove();
        // CKEditor related
        $(root).find('.cke_image_resizer, .cke_widget_drag_handler_container').remove();

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
const detectnPatch = (list, initSrc, mode, finalSrc) => {
    let elem;

    list.map((el) => {
        let nodeType;
        let patchType;
        switch (el.type) {
            case 0:
                break;
            case 1:
                const textArray = deepSearch(el, 'text');
                initSrc = handleTEXT(textArray[0], textArray[1], initSrc);
                break;
            case 2:
                nodeType = el.vNode.constructor.name;
                patchType = el.patch.constructor.name;
                if(nodeType === 'VirtualText')
                    initSrc = handleTEXT(el.vNode, el.patch.children[0], initSrc);
                if(nodeType === 'VirtualNode' || patchType === 'VirtualNode')
                    initSrc = handlePROPS(el.patch, el.patch.properties, initSrc, finalSrc, true);
                break;
            case 3:
                elem = createElement(el.vNode);
                break;
            case 4:
                initSrc = handlePROPS(el.vNode, el.patch, initSrc);
                break;
            case 5:
                elem = createElement(el.patch);
                break;
            case 6:
                initSrc = handleINSERT(el, initSrc, finalSrc);
                break;
            case 7:
                nodeType = el.vNode.constructor.name;
                if(nodeType === 'VirtualNode') initSrc = handleREMOVE(el, initSrc, finalSrc);
                break;
            default:
        }
    });

    return initSrc;
};

module.exports = {
    preprocess: preprocessSrc,
    construct: detectnPatch,
    setKeys: setKeys,
    compareWrapperIds: compareWrapperIds
};
