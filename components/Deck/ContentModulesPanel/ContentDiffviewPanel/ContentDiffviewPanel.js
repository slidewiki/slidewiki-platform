import React, {Component, PropTypes} from 'react';
import {Dropdown} from 'semantic-ui-react';
import diff from 'virtual-dom/diff';
import {connectToStores} from 'fluxible-addons-react';

import ContentHistoryStore from '../../../../stores/ContentHistoryStore';

import diff_fns from './diff_funcs';

class ContentDiffviewPanel extends Component {

    static propTypes = {
        content: PropTypes.string,
        currentRevision: PropTypes.string,
        revisionsList: PropTypes.array
    }

    static defaultProps = {
        content: ' '
    }

    state = {
        content: this.props.content,
        currentRevision: this.props.selector.sid.split('-')[1],
        revisionsList: this.props.ContentHistoryStore.history
    }

    diff = (e) => {
        e.preventDefault();

        const diffID = this.refs.dropdown.state.value;
        if(!diffID){
            this.setState({content: 'PLEASE SELECT A REVISION FROM THE DROPDOWN'});
            return;
        }

        let baseSRC = this.state.revisionsList.find((el) => el.id === parseInt(this.state.currentRevision)).content;
        let diffSRC = this.state.revisionsList.find((el) => el.id === parseInt(this.refs.dropdown.state.value)).content;

        //FETCH 2 html strings to DIFF
        // let diffSRC = '<h1 id="h1-1">STatic text part 1</h1><p id="p-1">THEN text</p><p id="p-2">Static</p><p id="p-3"><span id="sp-1" style="color:#e74c3c;">Color in red</span></p><p id="p-4">To delete</p><h2 id="h2-1">Title 1</h2>';
        // let baseSRC = '<h1 id="h1-1">STatic text part 1</h1><p id="p-1">NOW text</p><p id="p-2">Static</p><p id="p-3"><span id="sp-1" style="color:#f1c40f;">Color in yellow</span></p><h2 id="h2-1">Title 1</h2><p id="p-5">New paragraph</p><h1 id="h1-2">NEWEST TITLE</h1>';

        const isUploaded = diffSRC.indexOf('pptx2html') !== -1;
        //PRE-PROCESS & CONVERT html into hyperscript
        diffSRC = diff_fns.preprocess(diffSRC, isUploaded);
        baseSRC = diff_fns.preprocess(baseSRC, isUploaded);

        const vTree = diff_fns.setKeys(diffSRC);
        const vTree2 = diff_fns.setKeys(baseSRC);

        //DIFF 2 vTrees
        const diff_results = diff(vTree, vTree2);

        //Reduce complex Object into flat Array
        const elements = Object.keys(diff_results).reduce((arr, key) => arr.concat(diff_results[key]), []);

        //LOG
        // console.group();
        // elements.map((e) => console.log('%c node:', 'color: red', e));
        // console.groupEnd();

        //Construct Diff VIEW Slide
        diffSRC = diff_fns.construct(elements, diffSRC, isUploaded);

        //Update state
        this.setState({content: diffSRC});
    }

    render() {
        const revisions = this.state.revisionsList.map((el) => {
            const disable = el.id === parseInt(this.state.currentRevision) ? true : false;
            return {key: el.id, text: `Revision ${el.id}`, value: el.id, disabled: disable};
        });

        const diffType = this.props.selector.stype;
        //TODO load 2 different sub-components DECK / SLIDE_ID

        return (
            <div ref="ContentDiffviewPanel" className="ui">
                <h1><span>{diffType}</span> – Diff View</h1>
                <p>Diff the current revision against:</p>
                <Dropdown placeholder='Select Revision' ref="dropdown" selection options={revisions}/>
                <button className="ui blue icon button" onClick={this.diff}>DIFF</button>
                <div className='diff-view' dangerouslySetInnerHTML={{__html: this.state.content}}></div>
            </div>
        );
    }
}

ContentDiffviewPanel = connectToStores(ContentDiffviewPanel, [ContentHistoryStore], (context, props) => {
    return {ContentHistoryStore: context.getStore(ContentHistoryStore).getState()};
});

export default ContentDiffviewPanel;
