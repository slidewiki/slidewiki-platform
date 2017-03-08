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
        return `<span style="background-color:red; text-decoration: line-through;">${oldt}</span>
                <span style="background-color:green;">${newt}</span>`;
    }

    diff = (e) => {
        e.preventDefault();
        //FETCH 2 html strings to DIFF
        let src = '<div class="wrap"><div id="some-id" class="foo"><span>THEN text</span><p>Static</p><p style="color:red; font-size: 14px;">Red</p><p>Red</p></div></div>';
        let src2 = '<div class="wrap"><div id="some-id" class="bar"><span>NOW text</span><p>Static</p><p style="color:yellow; font-size: 14px;">Yellow</p></div><div class="slide_1"><h1>Title</h1></div></div>';
        let src2html = $.parseHTML(src2);

        //CONVERT html into hyperscript
        const vTree = convertHTML(src);
        // let counter = 0
        // var convertHTMLWithKey = convertHTML.bind(null, {
        //     getVNodeKey: function(object) {
        //         console.log(object);
        //         return object.id || ++counter;
        //     }
        // });
        //
        // const keyTree = convertHTMLWithKey(src);
        // console.log(keyTree);
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

        let elem;

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
                    src = src.replace(oldtext, newtt);
                    //SAVE CHANGES
                    //USE REGEX TO Traverse it as a string and change the text
                    //Maybe add promise to do it at the end
                    //check is modified class is there || add one
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
                    let root = createElement(convertHTML(src));
                    $(root).append(elem);
                    src = root.outerHTML;

                    break;

                case 7:
                    console.warn('REMOVE');
                    elem = createElement(el.vNode);
                    $(elem).addClass('deleted');
                    console.log(elem);
                    // const tag = el.vNode.tagName;
                    // const text = el.vNode.children[0].text;
                    // console.log(tag);
                    // console.log(text);
                    // $( "div:contains('John')" ).addClass

                    // console.log(elem);
                    break;

                default:
                    console.warn('default');
                    // root = createElement(el);
            }
        });

        console.groupEnd();

        // console.log(createElement(convertHTML(src)));
        //this.setState({renderedDiff: root});
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
                <h1>Diff View</h1>
                <button onClick={this.diff}>DIFF</button>
                {this.state.defaultTxt}
            </div>
        );
    }

}
