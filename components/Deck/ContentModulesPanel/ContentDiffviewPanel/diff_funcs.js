import createElement from 'virtual-dom/create-element';
import VNode from 'virtual-dom/vnode/vnode';
import VText from 'virtual-dom/vnode/vtext';
const convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});
import $ from 'jquery';

//TODO FUnction that takes a string and returns a FUnction applying createElement(convertHTML());

const markText = (oldt, newt, mode) => {
    const uploaded = `<p class="txtdeleted">${oldt}</p><p class="txtadded">${newt}</p>`;
    const created = `<span class="txtdeleted">${oldt}</span><span class="txtadded">${newt}</span>`;
    return mode ? uploaded : created;
};

const handleTEXT = (el, source, mode) => {
    console.warn('TEXT');

    const oldText = el.vNode.text;
    const newText = el.patch.text;
    const markedText = markText(oldText, newText, mode);

    source = source.replace(oldText, markedText);

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

    // elem = createElement(el.vNode);
    // $(elem).addClass('deleted');
    // console.log(elem);

    const tag = el.vNode.tagName;
    const text = el.vNode.children[0].text;
    let root = createElement(convertHTML(source));
    $(root).find(`${tag}:contains('${text}')`).addClass('deleted');
    source = root.outerHTML;

    return source;
};

const handlePROPS = (el, source) => {
    console.warn('PROPS');

    const tag = el.vNode.tagName;
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

    if (mode) {
        //uploaded slide

        let root = createElement(convertHTML(source));
        $(root).find('.drawing-container').remove();
        $(root).find('span:empty').remove();
        //$(root).find('div:empty').remove();
        source = root.outerHTML;

    } else {
        //created slide

    }

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
                initSrc = handleTEXT(el, initSrc, mode);
                break;
            case 2:
                console.warn('VNODE');
                elem = createElement(el.vNode);
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
    construct: detectnPatch
};
