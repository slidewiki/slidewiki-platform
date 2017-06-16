import React from 'react';
//import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckTreeStore from '../../../stores/DeckTreeStore';
//import ActivityList from '../ActivityFeedPanel/ActivityList';
import ActivityFeedPanel from '../ActivityFeedPanel/ActivityFeedPanel';
import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';
import cheerio from 'cheerio';
import ContentModulesStore from '../../../stores/ContentModulesStore';


class InfoPanelInfoView extends React.Component {

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
                      <ContributorsPanel />
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
InfoPanelInfoView= connectToStores(InfoPanelInfoView, [DeckTreeStore,ContentModulesStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        ContentModulesStore: context.getStore(ContentModulesStore).getState()
    };
});
export default InfoPanelInfoView;
