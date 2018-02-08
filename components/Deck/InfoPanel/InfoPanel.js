import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import InfoPanelHeader from './InfoPanelHeader';
import InfoPanelInfoView from './InfoPanelInfoView';
import {equals} from '../../../common.js';

class InfoPanel extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        let samePropsState = equals(this.props, nextProps);
        // Content should be updated only when properties have changed.
        return !samePropsState;
    }

    componentDidUpdate() {
        console.log('Updated InfoPanel.');
    }

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
    executeAction: React.PropTypes.func.isRequired
};
InfoPanel = connectToStores(InfoPanel, [], (context, props) => {
    return {
    };
});

export default InfoPanel;
