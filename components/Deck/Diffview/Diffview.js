import React, {Component, PropTypes} from 'react';
import {Radio, Checkbox} from 'semantic-ui-react';
import diff from 'virtual-dom/diff';
import {connectToStores} from 'fluxible-addons-react';

import DiffViewStore from '../../../stores/DiffViewStore';

import diff_fns from './diff_funcs';

class DiffView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            diffcontent: this.props.content,
            currContent: this.props.content,
            base: this.props.DiffViewStore.baseSlide,
            diff: this.props.DiffViewStore.diffSlide,
            error: '',
            show: {
                add: true,
                mod: true,
                del: true,
                text: true
            }
        };

        this.toggleColor = this.toggleColor.bind(this);
    }

    componentDidMount() {
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

    toggleColor() {
        this.setState({
            inverse: !this.state.inverse
        });
    }

    toggleVisibleChanges(mode) {
        let show = this.state.show;
        show[mode] = !show[mode];

        this.setState({ show });
    }

    resize() {
        let containerwidth = document.getElementById('container').offsetWidth;
        let pptxwidth = $('.pptx2html').width();
        this.scaleratio = containerwidth / (pptxwidth);
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});
        $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
    }

    diff() {

        /** FETCH 2 html strings to DIFF
        * baseSRC - current slide version
        * diffSRC - toDIFF slide verion
        */
        if(!this.state.base || !this.state.diff) {
            this.setState({error: <ErrorContent />});
            return;
        }

        let baseSRC = this.state.base.content;
        let diffSRC = this.state.diff.content;

        //CHECK if the slide was uploaded or created
        const isUploaded = diffSRC.indexOf('pptx2html') !== -1;
        //PRE-PROCESS & CONVERT html into hyperscript
        diffSRC = diff_fns.preprocess(diffSRC, isUploaded);
        baseSRC = diff_fns.preprocess(baseSRC, isUploaded);

        //ADD unique ID as key per element
        const vTree = diff_fns.setKeys(diffSRC);
        const vTree2 = diff_fns.setKeys(baseSRC);

        if (!diff_fns.compareWrapperIds(diffSRC, baseSRC)) {
            this.setState({error: <ErrorVersion />});
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
        this.setState({diffcontent: diffSRC, currContent: baseSRC});
    }

    render() {
        const { base, diff, inverse, error, diffcontent, currContent, isLoaded, show } = this.state;

        if(!isLoaded) return (<div>Loading ...</div>);

        if(error) return (<div>{error}</div>);

        return (
            <div className="fluid container top-diff">
                <div className='helpers'>
                  <div className='diff-header'>
                    Settings
                  </div>
                  <div className='inlineContent'>
                    <Radio label='Change color palette' toggle onChange={this.toggleColor}/>
                    <Checkbox label='Show Addition' defaultChecked onChange={() => this.toggleVisibleChanges('add')} />
                    <Checkbox label='Show Mofidication' defaultChecked onChange={() => this.toggleVisibleChanges('mod')} />
                    <Checkbox label='Show Deletion' defaultChecked onChange={() => this.toggleVisibleChanges('del')} />
                    <Checkbox label='Show Text' defaultChecked onChange={() => this.toggleVisibleChanges('text')} />
                  </div>
                </div>

                <div className='reveal'>
                    <div className='slides'>
                        <div className={`diff-view
                            ${inverse && 'inverse'}
                            ${!show.add && 'hide-add'}
                            ${!show.mod && 'hide-mod'}
                            ${!show.del && 'hide-del'}
                            ${!show.text && 'hide-text'}
                            `}>
                            <div className='initVers' id='container'>
                              <div className='diff-header'>
                                Revision [ {base.id} ]
                              </div>
                              <div className='inlineContent' dangerouslySetInnerHTML={{__html: currContent}}></div>
                            </div>
                            <div className='mergedVers'>
                              <div className='diff-header'>
                                Diff view changes between [ {base.id} ] and [ {diff.id} ]
                              </div>
                              <div className='inlineContent' dangerouslySetInnerHTML={{__html: diffcontent}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

DiffView.defaultProps = {
    diffcontent: '',
    currContent: '',
    error: '',
    inverse: false,
    isLoaded: false
};

DiffView = connectToStores(DiffView, [DiffViewStore], (context, props) => {
    return {DiffViewStore: context.getStore(DiffViewStore).getState()};
});

export default DiffView;

const ErrorVersion = () => (
  <div className="ui error message text container left">
      <div className="header row">Error: Incompatible Revisions</div>
      <p>Unfortunately, the chosen revisions of the slide are incompatible for automatical generation of the difference changes, due to one of the following reasons:</p>
      <ul className="list">
          <li>The two revisions compared don't share the same template</li>
          <li>HTML code of the slide was manually modified</li>
      </ul>
      <p>A possible option is to go back and manually view the versions for changes</p>
  </div>
);

const ErrorContent = () => (
  <div className="ui error message text container left">
      <div className="header row">Error: Revisions Content</div>
      <p>An error occurred while fetching the content. Please visit the <b>History panel</b> of the slide and try once more.</p>
  </div>
);
