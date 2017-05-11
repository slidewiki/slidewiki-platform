import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckTreeStore from '../../../stores/SlideViewStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import PermissionsStore from '../../../stores/PermissionsStore';
import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';
import ContributorsStore from '../../../stores/ContributorsStore';


class InfoPanel extends React.Component {

    render() {
        const rootNodeStyles = {
            fontSize: '1.06em'
        };
        const slideTitle= = SlideViewStore.title;


        return (
            <div className="ui panel sw-info-panel" ref="infoPanel" >
                <div className="ui segments">
                    <div className="ui secondary segment">
                        <NavLink style={rootNodeStyles} href={'/deck/' + rootNode.id}>{rootNodeTitle}</NavLink>
                    </div>
                    <div className="ui top attached pointing icon stackable fluid large menu">
                        <div className="ui basic button">
                            <i className="very large info circle icon"></i>Info
                        </div>
                        <div className="ui basic button">
                            <i className="very large tag icon"></i>Suggest
                        </div>
                        <div className="ui basic button">
                            <i className="very large write icon"></i>Edit
                        </div>
                    </div>


                    <div className="ui bottom attached segment" >
                        <div className="ui compact segments">
                            <div className="ui attached segments">
                                <h4 className="header item">THis is the slide title </h4>
                                <div ref="contentModulesPanel">
                                    <div className="ui segment attached">
                                        {ContributorsPanel}
                                    </div>
                                </div>

                            </div>
                        </div>




                    </div>
                </div>
            </div>
        );
    }
}

InfoPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TreePanel = connectToStores(InfoPanel, [SlideViewStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default InfoPanel;
