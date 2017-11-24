import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import ServiceErrorStore from '../../stores/ServiceErrorStore';
import hideLeftColumn from '../../actions/deckpagelayout/hideLeftColumn';
import restoreDeckPageLayout from '../../actions/deckpagelayout/restoreDeckPageLayout';
import TreePanel from './TreePanel/TreePanel';
//import SlideEditPanel from './SlideEditPanel/SlideEditPanel';
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
        /*
        let leftColClassSlideEdit = classNames({
            'three':  status.SlideEditPanel.columnSize===3 || status.ActivityFeedPanel.columnSize===3,
            'four':  status.SlideEditPanel.columnSize===4 || status.ActivityFeedPanel.columnSize===4,
            'twelve':  status.SlideEditPanel.columnSize===12 || status.ActivityFeedPanel.columnSize===12,
            'sixteen':  status.SlideEditPanel.columnSize===16 || status.ActivityFeedPanel.columnSize===16,
            'wide column': status.SlideEditPanel.visible || status.ActivityFeedPanel.visible,
            'hide-element': !status.SlideEditPanel.visible && !status.ActivityFeedPanel.visible
        });
        let SlideEditPanelClass = classNames({
            'hide-element': !status.SlideEditPanel.visible
        });
        */
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
        /*
        let leftPanel;
        if(this.props.DeckPageStore.mode === 'edit' && this.props.DeckPageStore.selector.stype === 'slide' && this.props.DeckPageStore.selector.spath !== '')
        {
            //if we view a slide in edit mode - show slide edit panel
            leftPanel =      <div className={leftColClassSlideEdit}>
                                <div className="row">
                                    <div className={SlideEditPanelClass}>
                                        <SlideEditPanel mode={this.props.DeckPageStore.mode} page={this.props.DeckPageStore.page}/>
                                    </div>
                                    <div className="ui hidden divider"></div>
                                </div>
                            </div>;
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
                                    </div>*//*}
                                    <div className="ui hidden divider"></div>
                                </div>
                            </div>;
        }
        */
        return (
            <div className="ui fluid container" ref="deck">
                <div className="ui padded stackable grid ">
                <div className="row">
                    {/*}<div className={navigationPanelClass}>
                      <NavigationPanel />
                    </div>*/}
                </div>


                <div className={leftColClass}>
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
                </div>
                {/*leftPanel*/}

                {dividerDIV}

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
                </div>

                <div className={rightColClass}>
                    <div className={treePanelClass}>
                        <InfoPanel />
                    </div>

                    <div className="ui hidden divider"></div>
                </div>



                </div>
                {error.hasOwnProperty('statusCode') ? <ServiceUnavailable error={this.props.ServiceErrorStore.error} /> : ''}
            </div>

        );
    }
}

Deck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
Deck = connectToStores(Deck, [DeckPageStore, ServiceErrorStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState(),
        ServiceErrorStore: context.getStore(ServiceErrorStore).getState(),
    };
});
export default Deck;
