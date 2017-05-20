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
        inverse: false,
        isLoaded: false
    }

    state = {
        diffcontent: this.props.content,
        currContent: this.props.content,
        base: this.props.DiffViewStore.baseSlide,
        diff: this.props.DiffViewStore.diffSlide
    }

    componentDidMount = () => {
        this.diff();
        this.setState({ isLoaded: true });
        window.addEventListener('resize', (evt) => {
            if(process.env.BROWSER){
                this.forceUpdate();
            }
        });
    }

    componentDidUpdate() {
        if(process.env.BROWSER){
            this.resize();
        }
    }

    toggleColor = () => {
        this.setState({
            inverse: !this.state.inverse
        });
    }

    resize = () => {
        let containerwidth = document.getElementById('container').offsetWidth;
        let pptxwidth = $('.pptx2html').width();
        this.scaleratio = containerwidth / (pptxwidth);
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});
        $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
    }

    diff = () => {

        /** FETCH 2 html strings to DIFF
        * baseSRC - current slide version
        * diffSRC - toDIFF slide verion
        */
        let baseSRC = this.state.base.content;
        let diffSRC = this.state.diff.content;

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
        const { base, diff, inverse, diffcontent, currContent, isLoaded } = this.state;

        if(!isLoaded) return (<div>Loading ...</div>);

        return (
            <div className="fluid container ui top-diff">
              <div className='ui'>
                <div className='helpers'>Change color palette:
                    <Radio toggle onChange={this.toggleColor}/>
                </div>

                <div className='reveal'>
                    <div className='slides'>
                        <div className={`diff-view ${inverse ? 'inverse' : ''} `}>
                            <div className='initVers' id='container'>
                              <span>Revision [#{base.id}]</span>
                              <div className='inlineContent' dangerouslySetInnerHTML={{__html: currContent}}></div>
                            </div>
                            <div className='mergedVers'>
                              <span>Diff view changes between: [#{base.id}] and [#{diff.id}]</span>
                              <div dangerouslySetInnerHTML={{__html: diffcontent}}></div>
                            </div>
                        </div>
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
