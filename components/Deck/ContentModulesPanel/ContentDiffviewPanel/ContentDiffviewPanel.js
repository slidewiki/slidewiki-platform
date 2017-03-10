import React, {Component, PropTypes} from 'react';

import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

import VNode from 'virtual-dom/vnode/vnode';
import VText from 'virtual-dom/vnode/vtext';

const convertHTML = require('html-to-vdom')({VNode: VNode, VText: VText});

import $ from 'jquery';

export default class ContentDiffviewPanel extends Component {

    static propTypes = {
        defaultTxt: PropTypes.string
    }

    static defaultProps = {
        defaultTxt: 'default text'
    }

    state = {
        defaultTxt: this.props.defaultTxt
    }

    markText = (oldt, newt) => {
        return `<span class="txtdeleted">${oldt}</span>
                <span class="txtadded">${newt}</span>`;
    }

    diff = (e) => {
        e.preventDefault();
        //FETCH 2 html strings to DIFF
        let src = '<div class="wrap"><div id="some-id" class="foo"><p>Static text part 1</p><span>THEN text</span><p>Static</p><p style="color:red; font-size: 14px;">Colored in red</p><p>Red</p></div></div>';
        let src2 = '<div class="wrap"><div id="some-id" class="bar"><p>Static text part 1</p><span>NOW text</span><p>Static</p><p style="color:yellow; font-size: 14px;">Colorized in yellow</p></div><div class="slide_1"><h1>Title</h1></div></div>';

        //CONVERT html into hyperscript
        const vTree = convertHTML(src);
        const vTree2 = convertHTML(src2);

        //DIFF 2 vTrees
        const diff_results = diff(vTree, vTree2);
        const elements = Object.keys(diff_results).map((e) => {
            return diff_results[e];
        });
        // console.log(elements);

        //LOG
        console.group();
        //elements.map((e) => console.log('%c node:', 'color: red', e));
        console.groupEnd();

        let elem, root;

        console.group();
        console.info('Changes');
        //TODO !!! START AND FINISH EACH CASE BY SAVING THE CHANGES TO THE DOM/STRING ELEMENT
        elements.map((el) => {
            switch (el.type) {
                case 0:
                    console.warn('NONE');
                    break;

                case 1:
                    console.warn('TEXT');
                    let oldtext = el.vNode.text;
                    let newtext = el.patch.text;
                    let newtt = this.markText(oldtext, newtext);
                    //TODO regex replace all &nbsp; to white space + other occurings
                    src = src.replace(oldtext, newtt);
                    break;

                case 2:
                    console.warn('VNODE');
                    elem = createElement(el.vNode);
                    // console.log(elem);
                    break;

                case 3:
                    console.warn('WIDGET');
                    elem = createElement(el.vNode);
                    // console.log(elem);
                    break;

                case 4:
                    //TODO patch changes to the new
                    console.warn('PROPS');
                    //HOw to find a node that was changed
                    // console.log(el);
                    const patch = el.patch;
                    elem = createElement(el.vNode);
                    // console.log(elem);
                    $(elem).addClass('modified');
                    // console.log(elem);
                    break;

                case 5:
                    console.warn('ORDER');
                    elem = createElement(el.patch);
                    // console.log(elem);
                    break;

                case 6:
                    console.warn('INSERTED');
                    elem = createElement(el.patch);
                    $(elem).addClass('added');
                    root = createElement(convertHTML(src));
                    $(root).append(elem);
                    src = root.outerHTML;

                    break;

                case 7:
                    console.warn('REMOVE');

                    // elem = createElement(el.vNode);
                    // $(elem).addClass('deleted');
                    // console.log(elem);

                    const tag = el.vNode.tagName;
                    const text = el.vNode.children[0].text;
                    root = createElement(convertHTML(src));
                    $(root).find(`${tag}:contains('${text}')`).addClass('deleted');
                    src = root.outerHTML;

                    break;

                default:
                    console.warn('default');
                    // root = createElement(el);
            }
        });

        console.groupEnd();

        // console.log(src);
        this.setState({defaultTxt: src});
    }

    render() {

        //TODO if collected all changes, combine & render
        // const {
        //       model,
        //       title
        //     } = this.props
        //
        return (
            <div>
                <h1>Diff View --> <button className="ui blue icon button" onClick={this.diff}>DIFF</button></h1>
                <div className='diff-view' dangerouslySetInnerHTML={{__html:this.state.defaultTxt}}></div>
            </div>
        );
    }

}
