import React, {Component, PropTypes} from 'react';
import {Dropdown} from 'semantic-ui-react';
import diff from 'virtual-dom/diff';
import {connectToStores} from 'fluxible-addons-react';

import ContentHistoryStore from '../../../../stores/ContentHistoryStore';

import diff_fns from './diff_funcs';

class ContentDiffviewPanel extends Component {

    static propTypes = {
        defaultTxt: PropTypes.string
    }

    static defaultProps = {
        defaultTxt: 'default text'
    }

    state = {
        defaultTxt: this.props.defaultTxt
    }

    diff = (e) => {
        e.preventDefault();
        //FETCH 2 html strings to DIFF
        let src = '<div name="inlineContent" id="inlineContent" style="min-width: 100%; min-height: 450px; overflow: auto;"><h1 id="h1-1">STatic text part 1</h1><p id="p-1">THEN text</p><p id="p-2">Static</p><p id="p-3"><span id="sp-1" style="color:#e74c3c;">Color in red</span></p><p id="p-4">To delete</p><h2 id="h2-1">Title 1</h2></div>';
        src = src.replace(/&nbsp;/g, ' ');

        let src2 = '<div name="inlineContent" id="inlineContent" style="min-width: 100%; min-height: 450px; overflow: auto;"><h1 id="h1-1">STatic text part 1</h1><p id="p-1">NOW text</p><p id="p-2">Static</p><p id="p-3"><span id="sp-1" style="color:#f1c40f;">Color in yellow</span></p><h2 id="h2-1">Title 1</h2><p id="p-5">New paragraph</p><h1 id="h1-2">NEWEST TITLE</h1></div>';
        src2 = src2.replace(/&nbsp;/g, ' ');


        const isUploaded = src.indexOf('pptx2html') !== -1;
        //PRE-PROCESS & CONVERT html into hyperscript
        const vTree = diff_fns.preprocess(src, isUploaded);
        const vTree2 = diff_fns.preprocess(src2, isUploaded);

        //DIFF 2 vTrees
        const diff_results = diff(vTree, vTree2);

        //Reduce complex Object into flat Array
        const elements = Object.keys(diff_results).reduce((arr, key) => arr.concat(diff_results[key]), []);

        //LOG
        // console.group();
        // elements.map((e) => console.log('%c node:', 'color: red', e));
        // console.groupEnd();

        //Construct Diff VIEW Slide
        src = diff_fns.construct(elements, src, isUploaded);

        //Update state
        this.setState({defaultTxt: src});
    }

    render() {
        return (
            <div>
                <h1>Diff View --> <button className="ui blue icon button" onClick={this.diff}>DIFF</button></h1>
                <div className='diff-view' dangerouslySetInnerHTML={{__html:this.state.defaultTxt}}></div>
            </div>
        );
    }
}

ContentDiffviewPanel = connectToStores(ContentDiffviewPanel, [ContentHistoryStore], (context, props) => {
    return {ContentHistoryStore: context.getStore(ContentHistoryStore).getState()};
});

export default ContentDiffviewPanel;
