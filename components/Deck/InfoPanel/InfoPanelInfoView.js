import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
//import ActivityList from '../ActivityFeedPanel/ActivityList';
import ActivityFeedPanel from '../ActivityFeedPanel/ActivityFeedPanel';
import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';
import cheerio from 'cheerio';
import PresentationPanel from './PresentationsPanel';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import TranslationPanel from '../Translation/TranslationPanel';


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

        //change the node icon based on the type of node and its expanded state
        //let iconClass = classNames({
        //    'ui icon': true,
        //    'grey file text': (this.props.DeckTreeStore.get('type') === 'slide'),
        //    'yellow folder link': (this.props.DeckTreeStore.get('type') === //'deck'),
        //});

        let rootNode = {'title': deckTree.get('title'), 'id': deckTree.get('id')};
        let self = this;
        let nodes = [];
        let list, output = '';
        let title = '';
        let titlediv;
        let pathNames = this.getNameofNodes(deckTree, selector);
        if(selector.get('spath')){
            nodes = selector.get('spath').split(';');
            list = nodes.map((node, index) => {
                if(index === (nodes.length - 1)){
                    return (
                        cheerio.load(pathNames[index]).text()
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
            title = list; //use title of slide
            titlediv =
            <div className="ui segment top attached compact">
                <h3 className="ui small header">
                   <i className="grey small file text icon" aria-label="Slide title"></i>
                   {title}
                </h3>
            </div>;

        }
        else {
            //title = rootNode.title;
            //title = ''; //use title of deck
            titlediv = '';

        }
        return (
            <div className="ui container" ref="infoPanel" role="complementary">
                {this.props.DeckTreeStore.revisionId !== this.props.DeckTreeStore.latestRevisionId &&
                    <div className="ui vertical segment"><NavLink className="" href={'/deck/' + selector.get('id').split('-')[0]}><i className='warning sign icon'></i>
                        Updated version available</NavLink>
                    </div>}
                    {titlediv}
                <div className="ui attached segment">
                    <ContributorsPanel />
                </div>
                <div className="ui attached segment">
                    <TranslationPanel />
                </div>
                <div className="ui attached segment">
                    <ActivityFeedPanel />
                </div>
                {this.props.ActivityFeedStore.selector.stype === 'deck' ? (
                  <div className="ui attached segment">
                      <PresentationPanel />
                  </div>
                ) : ''}

                <div className="ui attached segment">
                    <div className={['ui', 'image']}>
                        <a href="http://creativecommons.org/licenses/by-sa/4.0/" target="_blank" tabIndex="-1" alt="">
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
InfoPanelInfoView= connectToStores(InfoPanelInfoView, [ActivityFeedStore, DeckTreeStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default InfoPanelInfoView;
