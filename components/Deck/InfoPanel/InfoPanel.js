import PropTypes from 'prop-types';
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
                       <InfoPanelInfoView />
        );
    }
}

InfoPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
InfoPanel = connectToStores(InfoPanel, [], (context, props) => {
    return {
    };
});

export default InfoPanel;
