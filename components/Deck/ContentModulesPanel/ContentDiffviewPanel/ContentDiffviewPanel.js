import React, {Component, PropTypes} from 'react';
import {Dropdown, Radio} from 'semantic-ui-react';
import diff from 'virtual-dom/diff';
import {connectToStores} from 'fluxible-addons-react';

import ContentHistoryStore from '../../../../stores/ContentHistoryStore';

import diff_fns from './diff_funcs';

const MESSAGES = {
    'Warning_DropDown': 'PLEASE SELECT A REVISION FROM THE DROPDOWN',
    'Error_Version': 'Sorry, the chosen revisions are incompatible to perform diff operation over. It may be cause by one of the reasons below: 1. Different templates applied. \n 2. Another reason'
};

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
        revisionsList: this.props.ContentHistoryStore.history,
        inverse: false
    }

    toggleColor = () => {
        this.setState({inverse: !this.state.inverse});
    }

    diff = (e) => {
        e.preventDefault();

        const diffID = this.refs.dropdown.state.value;
        if(!diffID){
            this.setState({content: MESSAGES.Warning_DropDown});
            return;
        }

        //FETCH 2 html strings to DIFF
        let baseSRC = this.state.revisionsList.find((el) => el.id === parseInt(this.state.currentRevision)).content;
        let diffSRC = this.state.revisionsList.find((el) => el.id === parseInt(this.refs.dropdown.state.value)).content;

        const isUploaded = diffSRC.indexOf('pptx2html') !== -1;
        //PRE-PROCESS & CONVERT html into hyperscript
        diffSRC = diff_fns.preprocess(diffSRC, isUploaded);
        baseSRC = diff_fns.preprocess(baseSRC, isUploaded);

        //ADD ID as key per element
        const vTree = diff_fns.setKeys(diffSRC);
        const vTree2 = diff_fns.setKeys(baseSRC);

        if(!diff_fns.compareWrapperIds(diffSRC, baseSRC)){
            this.setState({content: MESSAGES.Error_Version});
            return;
        }

        //DIFF 2 vTrees
        const diff_results = diff(vTree, vTree2);

        //REDUCE complex Object into flat Array
        const elements = Object.keys(diff_results).reduce((arr, key) => arr.concat(diff_results[key]), []);

        //LOG
        // console.group();
        // elements.map((e) => console.log('%c node:', 'color: red', e));
        // console.groupEnd();

        //CONSTRUCT Diff view Slide
        diffSRC = diff_fns.construct(elements, diffSRC, isUploaded, baseSRC);

        //UPDATE state
        this.setState({content: diffSRC});
    }

    render() {
        const { content, currentRevision, inverse } = this.state;

        const revisions = this.state.revisionsList.map((el) => {
            const disable = el.id === parseInt(this.state.currentRevision) ? true : false;
            return {key: el.id, text: `Revision ${el.id}`, value: el.id, disabled: disable};
        });

        const diffType = this.props.selector.stype;
        //TODO load 2 different sub-components DECK / SLIDE_ID

        return (
            <div ref="ContentDiffviewPanel" className="ui">
                <h1><span>{diffType}</span> – Diff View</h1>
                <p>Change color palette: <Radio toggle onChange={this.toggleColor} /></p>
                <p>Diff the current revision [{currentRevision}] against:</p>
                <Dropdown placeholder='Select Revision' ref="dropdown" selection options={revisions}/>
                <button className="ui blue icon button" onClick={this.diff}>DIFF</button>
                <div className={`diff-view ${inverse ? 'inverse' : ''} `} dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
        );
    }
}

ContentDiffviewPanel = connectToStores(ContentDiffviewPanel, [ContentHistoryStore], (context, props) => {
    return {ContentHistoryStore: context.getStore(ContentHistoryStore).getState()};
});

export default ContentDiffviewPanel;
