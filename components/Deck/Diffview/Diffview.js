import React, {Component, PropTypes} from 'react';
import {Radio} from 'semantic-ui-react';
import diff from 'virtual-dom/diff';
import {connectToStores} from 'fluxible-addons-react';

import DiffViewStore from '../../../stores/DiffViewStore';

import diff_fns from './diff_funcs';

const MESSAGES = {
    'Error_Version': 'Error message'
};

class DiffView extends Component {

    static defaultProps = {
        diffcontent: ' ',
        currContent: ' ',
        inverse: false
    }

    state = {
        diffcontent: this.props.content,
        currContent: this.props.content,
        revisionsList: [],
        currentRevision: '5',
        diffRevision: '3'
    }

    toggleColor = () => {
        this.setState({
            inverse: !this.state.inverse
        });
    }

    diff = () => {

        /** FETCH 2 html strings to DIFF
        * baseSRC - current slide version
        * diffSRC - toDIFF slide verion
        */
        let baseSRC = this.state.revisionsList.find((el) => el.id === parseInt(this.state.currentRevision)).content;
        let diffSRC = this.state.revisionsList.find((el) => el.id === parseInt(this.state.diffRevision)).content;

        const isUploaded = diffSRC.indexOf('pptx2html') !== -1;
        //PRE-PROCESS & CONVERT html into hyperscript
        diffSRC = diff_fns.preprocess(diffSRC, isUploaded);
        baseSRC = diff_fns.preprocess(baseSRC, isUploaded);

        //ADD ID as key per element
        const vTree = diff_fns.setKeys(diffSRC);
        const vTree2 = diff_fns.setKeys(baseSRC);

        if (!diff_fns.compareWrapperIds(diffSRC, baseSRC)) {
            this.setState({currContent: MESSAGES.Error_Version});
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
        this.setState({diffcontent: diffSRC});
        this.setState({currContent: baseSRC});
    }

    render() {
        const {inverse, diffcontent, currContent} = this.state;
        // const params = window.location.href.split("?")[1];

        return (
            <div className="ui top-diff">
                <div className='helpers'>Change color palette:
                    <Radio toggle onChange={this.toggleColor}/>
                    <div className='revisions'>
                      <span>Latest revision</span>
                      <span>Diff view changes</span>
                    </div>
                </div>


                <div className='reveal'>
                    <div className='slides'>
                        <div className={`diff-view ${inverse ? 'inverse' : ''} `}>
                            <div className='initVers' dangerouslySetInnerHTML={{__html: currContent}}></div>
                            <div className='mergedVers' dangerouslySetInnerHTML={{__html: diffcontent}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

DiffView = connectToStores(DiffView, [DiffViewStore], (context, props) => {
    return {DiffViewStore: context.getStore(DiffViewStore).getState()};
});

export default DiffView;
