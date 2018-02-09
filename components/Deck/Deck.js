import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import ServiceErrorStore from '../../stores/ServiceErrorStore';
import UserProfileStore from '../../stores/UserProfileStore';
import hideLeftColumn from '../../actions/deckpagelayout/hideLeftColumn';
import restoreDeckPageLayout from '../../actions/deckpagelayout/restoreDeckPageLayout';
import TreePanel from './TreePanel/TreePanel';
import SlideEditLeftPanel from './SlideEditLeftPanel/SlideEditLeftPanel';
import ContentPanel from './ContentPanel/ContentPanel';
import ContentModulesPanel from './ContentModulesPanel/ContentModulesPanel';
//import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';
import ServiceUnavailable from '../Error/ServiceUnavailable';
import InfoPanel from './InfoPanel/InfoPanel';

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
        const error = this.props.ServiceErrorStore.error;
        let status = this.props.DeckPageStore.componentsStatus;
        let navigationPanelClass = classNames({
            'twelve': status.NavigationPanel.columnSize===12,
            'sixteen': status.NavigationPanel.columnSize===16,
            'wide column': status.NavigationPanel.visible,
            'hide-element': !status.NavigationPanel.visible
        });
        let leftColClass = classNames({
            'three':  status.TreePanel.columnSize===3 || status.ActivityFeedPanel.columnSize===3,
            'four':  status.TreePanel.columnSize===4 || status.ActivityFeedPanel.columnSize===4,
            'twelve':  status.TreePanel.columnSize===12 || status.ActivityFeedPanel.columnSize===12,
            'sixteen':  status.TreePanel.columnSize===16 || status.ActivityFeedPanel.columnSize===16,
            'wide column': status.TreePanel.visible || status.ActivityFeedPanel.visible,
            'hide-element': !status.TreePanel.visible && !status.ActivityFeedPanel.visible
        });
        let treePanelClass = classNames({
            'hide-element': !status.TreePanel.visible
        });
        let leftColClassSlideEdit = classNames({
            'three':  status.SlideEditLeftPanel.columnSize===3 || status.ActivityFeedPanel.columnSize===3,
            'four':  status.SlideEditLeftPanel.columnSize===4 || status.ActivityFeedPanel.columnSize===4,
            'twelve':  status.SlideEditLeftPanel.columnSize===12 || status.ActivityFeedPanel.columnSize===12,
            'sixteen':  status.SlideEditLeftPanel.columnSize===16 || status.ActivityFeedPanel.columnSize===16,
            'wide column': status.SlideEditLeftPanel.visible || status.ActivityFeedPanel.visible,
            'hide-element': !status.SlideEditLeftPanel.visible && !status.ActivityFeedPanel.visible
        });
        let SlideEditLeftPanelClass = classNames({
            'hide-element': !status.SlideEditLeftPanel.visible
        });
        /*
        let ActivityFeedPanelClass = classNames({
            'hide-element': !status.ActivityFeedPanel.visible
        });
        */
        let centerColClass = classNames({
            'four':  status.ContentPanel.columnSize===4 || status.ContentModulesPanel.columnSize===4,
            'ten':  status.ContentPanel.columnSize===10 || status.ContentModulesPanel.columnSize===10,
            'twelve':  status.ContentPanel.columnSize===12 || status.ContentModulesPanel.columnSize===12,
            'sixteen':  status.ContentPanel.columnSize===16 || status.ContentModulesPanel.columnSize===16,
            'wide column': status.ContentPanel.visible || status.ContentModulesPanel.visible
        });

        let contentPanelClass = classNames({
            'ten':  status.ContentPanel.columnSize===10,
            'twelve':  status.ContentPanel.columnSize===12,
            'sixteen':  status.ContentPanel.columnSize===16,
            'wide column': status.ContentPanel.visible,
            'hide-element': !status.ContentPanel.visible
        });
        let contentModulesPanelClass = classNames({
            'ten':  status.ContentModulesPanel.columnSize===10,
            'twelve':  status.ContentModulesPanel.columnSize===12,
            'sixteen':  status.ContentModulesPanel.columnSize===16,
            'wide column': status.ContentModulesPanel.visible,
            'hide-element': !status.ContentModulesPanel.visible
        });
        let contentAndRightPanelClass = classNames({
            'ten':  status.contentAndRightPanel.columnSize===10,
            'twelve':  status.contentAndRightPanel.columnSize===12,
            'thirteen':  status.contentAndRightPanel.columnSize===13,
            'sixteen':  status.contentAndRightPanel.columnSize===16,
            'wide column': status.contentAndRightPanel.visible,
            'hide-element': !status.contentAndRightPanel.visible
        });
        let contentAndRightModulesPanelClass = classNames({
            'ten':  status.contentAndRightModulesPanel.columnSize===10,
            'twelve':  status.contentAndRightModulesPanel.columnSize===12,
            'thirteen':  status.contentAndRightModulesPanel.columnSize===13,
            'sixteen':  status.contentAndRightModulesPanel.columnSize===16,
            'wide column': status.contentAndRightModulesPanel.visible,
            'hide-element': !status.contentAndRightModulesPanel.visible
        });
        let rightColClass = classNames({
            'three':  status.TreePanel.columnSize===3 || status.ActivityFeedPanel.columnSize===3,
            'four':  status.TreePanel.columnSize===4 || status.ActivityFeedPanel.columnSize===4,
            'twelve':  status.TreePanel.columnSize===12 || status.ActivityFeedPanel.columnSize===12,
            'sixteen':  status.TreePanel.columnSize===16 || status.ActivityFeedPanel.columnSize===16,
            'wide column': status.TreePanel.visible || status.ActivityFeedPanel.visible,
            'hide-element': !status.TreePanel.visible && !status.ActivityFeedPanel.visible,
            'ui container': true
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
        let leftPanel;
        let centerPanel;
        let rightPanel;
        if(this.props.DeckPageStore.mode === 'edit' && this.props.DeckPageStore.selector.stype === 'slide' && this.props.DeckPageStore.selector.spath !== '' && this.props.UserProfileStore.username !== '')
        {
            //TODO -> add check on wether you have edit rights!!!
            //if we view a slide in edit mode - show slide edit panel
            leftPanel = <div className={leftColClassSlideEdit}>
                            <div className="row">
                                <div className={SlideEditLeftPanelClass}>
                                    <SlideEditLeftPanel mode={this.props.DeckPageStore.mode} page={this.props.DeckPageStore.page}/>
                                </div>
                                <div className="ui hidden divider"></div>
                            </div>
                        </div>;
            centerPanel = (
                    <div className={contentAndRightPanelClass}>
                        <div className="row">
                            <div className={contentAndRightPanelClass}>
                                <ContentPanel />
                            </div>
                            <div className={contentAndRightModulesPanelClass}>
                                <div className="ui hidden divider"></div>
                                <div className="row">
                                    {this.props.DeckPageStore.mode !== 'view'? '' : <ContentModulesPanel mode='deck' />}
                                </div>
                            </div>
                        </div>
                    </div>
            );
        }
        else {
            //if we view something else - show decktree
            leftPanel =     <div className={leftColClass}>
                                <div className="row">
                                    <div className={treePanelClass}>
                                        <TreePanel mode={this.props.DeckPageStore.mode} page={this.props.DeckPageStore.page}/>
                                    </div>

                                    {/*<div className="ui hidden divider"></div>
                                    <div className={ActivityFeedPanelClass}>
                                        <div className="row">
                                            <ActivityFeedPanel />
                                        </div>
                                    </div>*/}
                                    <div className="ui hidden divider"></div>
                                </div>
                            </div>;

            centerPanel = (
                    <div className={centerColClass}>
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
                    </div>);
            rightPanel = (
                <div className={rightColClass}>
                    <div className={treePanelClass}>
                        <InfoPanel />
                    </div>

                    <div className="ui hidden divider"></div>
                </div>
            );

        }
        return (
            <div className="ui fluid container" ref="deck">
                <div className="ui padded stackable grid ">
                {/*}<div className="row">
                    <div className={navigationPanelClass}>
                      <NavigationPanel />
                    </div>
                </div>*/}

                {leftPanel}

                {dividerDIV}

                {centerPanel}

                {rightPanel}

                </div>
                {/*error.hasOwnProperty('statusCode') ? <ServiceUnavailable error={this.props.ServiceErrorStore.error} /> : ''*/}
            </div>

        );
    }
}

Deck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
Deck = connectToStores(Deck, [DeckPageStore, ServiceErrorStore, UserProfileStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState(),
        ServiceErrorStore: context.getStore(ServiceErrorStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
    };
});
export default Deck;
