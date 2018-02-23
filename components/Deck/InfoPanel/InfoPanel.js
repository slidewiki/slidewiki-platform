import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import InfoPanelHeader from './InfoPanelHeader';
import InfoPanelInfoView from './InfoPanelInfoView';
import {equals} from '../../../common.js';
import ContributorsStore from '../../../stores/ContributorsStore';

class InfoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.isLoading = this.isContentUndefined();
    }

    shouldComponentUpdate(nextProps, nextState) {
        let samePropsState = equals(this.props, nextProps);
        this.isLoading = this.isContentUndefined();
        // Content should be updated only when properties have changed.
        return !this.isLoading && !samePropsState;
    }

    componentWillReceiveProps(nextProps) {
        this.isLoading = this.isContentUndefined();
    }

    componentWillUnmount() {
        this.props.ContributorsStore.contributors = [];
        this.isLoading = true;
    }

    isContentUndefined() {
        return this.props.ContributorsStore.contributors === undefined
                || this.props.ContributorsStore.contributors === [];
    }


    render() {
        return (<InfoPanelInfoView loadingIndicator={this.props.ContributorsStore.loadingIndicator}/>);
    }
}

InfoPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
InfoPanel = connectToStores(InfoPanel, [ContributorsStore], (context, props) => {
    return {
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});

export default InfoPanel;
