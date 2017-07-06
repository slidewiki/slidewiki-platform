import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import InfoPanelHeader from './InfoPanelHeader';
import InfoPanelInfoView from './InfoPanelInfoView';


class InfoPanel extends React.Component {

    render() {
        const rootNodeStyles = {
            fontSize: '1.06em'
        };


        return (
            <div className="ui container" ref="infoPanel" role="complementary" >
                  <InfoPanelHeader  />
                   <div className="ui bottom attached segment">
                       <InfoPanelInfoView />
                </div>
            </div>
        );
    }
}

InfoPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
InfoPanel = connectToStores(InfoPanel, [], (context, props) => {
    return {
    };
});

export default InfoPanel;
