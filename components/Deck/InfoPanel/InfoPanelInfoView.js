import React from 'react';
//import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckTreeStore from '../../../stores/DeckTreeStore';
//import ActivityList from '../ActivityFeedPanel/ActivityList';
import ActivityFeedPanel from '../ActivityFeedPanel/ActivityFeedPanel';
import cheerio from 'cheerio';
import ContentModulesStore from '../../../stores/ContentModulesStore';
import loadContributors from '../../../actions/loadContributors';
import ContributorsStore from '../../../stores/ContributorsStore';
import ContributorsList from '../ContentModulesPanel/ContributorsPanel/ContributorsList';
//import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';


class InfoPanelInfoView extends React.Component {
    constructor(props) {
        super(props);
        //this.
    }
    getNameofNodes(tree, selector) {
        if(!selector.get('spath')){
            return 0;
        }
        let names = [];
        let nodes = selector.get('spath').split(';');
        let currentChildren = tree.get('children');
        let position = 0;
        nodes.forEach ((node, index) => {
            position = node.split(':')[1];
            names.push(currentChildren.get(position - 1).get('title'));
            if(currentChildren.get(position - 1).get('children')){
                currentChildren = currentChildren.get(position - 1).get('children');
            }
        });
        return names;
    }
    componentDidMount(){
        this.context.executeAction(loadContributors, {params: this.props.ContentModulesStore.selector});
    }
    render() {
        let deckTree = this.props.DeckTreeStore.deckTree;
        let selector = this.props.DeckTreeStore.selector;
        //let selector = this.props.DeckTreeStore.selector;
        ///let prevSelector = this.props.DeckTreeStore.prevSelector;
        //let nextSelector = this.props.DeckTreeStore.nextSelector;
        let rootNode = {'title': deckTree.get('title'), 'id': deckTree.get('id')};
        let self = this;
        let nodes = [];
        let list, output = '';
        let title = '';
        let pathNames = this.getNameofNodes(deckTree, selector);
        if(selector.get('spath')){
            nodes = selector.get('spath').split(';');
            list = nodes.map((node, index) => {
                if(index === (nodes.length - 1)){
                    return (
                        <div key={index} className="section">
                            {cheerio.load(pathNames[index]).text()}
                        </div>
                    );
                }else{
                    /*
                    return (
                        <div key={index} className="section">
                            <NavLink href={'/deck/' + self.props.selector.get('id') + '/deck/' + self.props.selector.get('sid') + '/' + (nodes[index - 1] ? (nodes[index - 1] + ';') : '') + node}>{this.props.pathNames[index]}</NavLink>
                            <i className="right chevron icon divider"></i>
                        </div>
                    );
                    */
                }

            });
            title = list; //use title of deck
        }
        else {
            title = rootNode.title;
        }

        return (
                <div >
                  <div className="ui attached segment">
                      <h4 className="header ui medium" >{title}</h4>
                  </div>
                  <div className="ui attached segment">
                  <b>Creator:</b>
                      <ContributorsList items={this.props.ContributorsStore.creator  }></ContributorsList>
                  <b>Contributors:</b>
                      {this.props.ContributorsStore.contributors.length === 0 ?
                      <div>There are no contributors for this {this.props.ContributorsStore.selector.stype}.</div> :
                      <ContributorsList items={this.props.ContributorsStore.contributors}></ContributorsList>}
                      {/*<ContributorsPanel />*/}
                  </div>
                  <div className="ui attached segment">
                      {/*<h4 className="ui medium header">Activity</h4>
                      <ActivityList />*/}
                      <ActivityFeedPanel />
                  </div>
                  <div className="ui attached segment">
                      <div className={['ui', 'image']}>
                        <a href="http://creativecommons.org/licenses/by-sa/4.0/" target="_blank">
                          <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
                        </a>
                        <p>
                          This work is licensed under a <a rel="license"  target="_blank" href="http://creativecommons.org/licenses/by-sa/4.0/" >Creative Commons Attribution-ShareAlike 4.0 International License</a>
                        </p>
                    </div>
                  </div>
                </div>
        );
    }
}

InfoPanelInfoView.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
InfoPanelInfoView= connectToStores(InfoPanelInfoView, [DeckTreeStore, ContentModulesStore, ContributorsStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        ContentModulesStore: context.getStore(ContentModulesStore).getState(),
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});
export default InfoPanelInfoView;
