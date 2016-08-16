import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import hideLeftColumn from '../../actions/deckpagelayout/hideLeftColumn';
import restoreDeckPageLayout from '../../actions/deckpagelayout/restoreDeckPageLayout';
import NavigationPanel from './NavigationPanel/NavigationPanel';
import TreePanel from './TreePanel/TreePanel';
import ContentPanel from './ContentPanel/ContentPanel';
import ContentModulesPanel from './ContentModulesPanel/ContentModulesPanel';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';

class Deck extends React.Component {
    handleExpandClick(){
        this.context.executeAction(hideLeftColumn, {});
        return false;
    }
    handleCollapseClick(){
        this.context.executeAction(restoreDeckPageLayout, {});
        return false;
    }
    render() {
        let status = this.props.DeckPageStore.componentsStatus;
        let navigationPanelClass = classNames({
            'twelve': status.NavigationPanel.columnSize===12,
            'sixteen': status.NavigationPanel.columnSize===16,
            'wide column': status.NavigationPanel.visible,
            'hide-element': !status.NavigationPanel.visible
        });
        let leftColClass = classNames({
            'four':  status.TreePanel.columnSize===4 || status.ActivityFeedPanel.columnSize===4,
            'twelve':  status.TreePanel.columnSize===12 || status.ActivityFeedPanel.columnSize===12,
            'sixteen':  status.TreePanel.columnSize===16 || status.ActivityFeedPanel.columnSize===16,
            'wide column': status.TreePanel.visible || status.ActivityFeedPanel.visible,
            'hide-element': !status.TreePanel.visible && !status.ActivityFeedPanel.visible
        });
        let treePanelClass = classNames({
            'hide-element': !status.TreePanel.visible
        });
        let ActivityFeedPanelClass = classNames({
            'hide-element': !status.ActivityFeedPanel.visible
        });
        let rightColClass = classNames({
            'four':  status.ContentPanel.columnSize===4 || status.ContentModulesPanel.columnSize===4,
            'twelve':  status.ContentPanel.columnSize===12 || status.ContentModulesPanel.columnSize===12,
            'sixteen':  status.ContentPanel.columnSize===16 || status.ContentModulesPanel.columnSize===16,
            'wide column': status.ContentPanel.visible || status.ContentModulesPanel.visible
        });
        let contentPanelClass = classNames({
            'twelve':  status.ContentPanel.columnSize===12,
            'sixteen':  status.ContentPanel.columnSize===16,
            'wide column': status.ContentPanel.visible,
            'hide-element': !status.ContentPanel.visible
        });
        let contentModulesPanelClass = classNames({
            'twelve':  status.ContentModulesPanel.columnSize===12,
            'sixteen':  status.ContentModulesPanel.columnSize===16,
            'wide column': status.ContentModulesPanel.visible,
            'hide-element': !status.ContentModulesPanel.visible
        });
        let oneColumnMode = 0;
        if(!status.TreePanel.visible && !status.ActivityFeedPanel.visible){
            oneColumnMode = 1;
        }
        let dividerDIV = '';
        if(oneColumnMode){
            if(status.ContentModulesPanel.visible){
                dividerDIV = <div className="ui" onClick={this.handleCollapseClick.bind(this)} title="show deck tree"><i className="icon link angle double right"></i> </div>;
            }
        }else{
            dividerDIV = <div className="ui vertical hidden divider fitted" onClick={this.handleExpandClick.bind(this)} title="hide deck tree"><i className="icon link angle double left"></i> </div>;
        }
        return (
            <div className="ui vertically padded stackable grid container" ref="deck">

                <div className="row">
                    <div className={navigationPanelClass}>
                      <NavigationPanel />
                    </div>
                </div>

                <div className={leftColClass}>
                    <div className="row">
                        <div className={treePanelClass}>
                            <TreePanel mode={this.props.DeckPageStore.mode} page={this.props.DeckPageStore.page}/>
                        </div>
                        <div className="ui hidden divider"></div>
                        <div className={ActivityFeedPanelClass}>
                            <div className="row">
                                <ActivityFeedPanel />
                            </div>
                        </div>
                        <div className="ui hidden divider"></div>
                    </div>
                </div>

                {dividerDIV}

                <div className={rightColClass}>
                    <div className="row">
                        <div className={contentPanelClass}>
                            <ContentPanel />
                        </div>
                        <div className={contentModulesPanelClass}>
                            <div className="ui hidden divider"></div>
                            <div className="row">
                                {this.props.DeckPageStore.mode !== 'view'? '' : <ContentModulesPanel mode='deck' />}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

Deck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
Deck = connectToStores(Deck, [DeckPageStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState()
    };
});
export default Deck;
