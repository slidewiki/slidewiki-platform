import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import PermissionsStore from '../../../stores/PermissionsStore';
import classNames from 'classnames';
import forkDeck from '../../../actions/decktree/forkDeck';
import Portal from 'react-portal';
import ContentUtil from './util/ContentUtil';
import {navigateAction} from 'fluxible-router';

class NoPermissionsModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = { modalHeight: 0 };
    }

    componentDidMount() {
        let modalHeight = window.$('#noPermissionsModal').outerHeight();
        this.setState({modalHeight: modalHeight});
    }

    handleForkClick(e) {
        this.context.executeAction(forkDeck, {deckId: this.props.selector.id});
    }

    handleCloseClick(e) {
        this.context.executeAction(navigateAction, {
            url: ContentUtil.makeNodeURL(this.props.selector, 'view')
        });
    }

    render() {
        let modalStyle = {
            'margin-top': - this.state.modalHeight / 2
        };

        return (
            <Portal isOpened={this.props.PermissionsStore.isNoPermissionsModalShown}>
                <div className="ui dimmer modals visible active page transition">
                    <div className="ui modal small transition visible active" style={modalStyle} id="noPermissionsModal">
                        <i className="close icon" tabIndex="0" onClick={this.handleCloseClick.bind(this)}></i>
                        <div className="header"><i className="warning sign icon"></i> No Edit Rights</div>
                        <div className="content">
                            <p>
                                You can only view this deck. To make changes, you may ask the owner to grant you edit rights or fork the deck.</p>
                        </div>
                        <div className="actions">
                            <button className="ui button disabled"><i className="edit icon"/>Request edit access</button>
                            <button className="ui button" tabIndex="0" onClick={this.handleForkClick.bind(this)}><i className="fork icon"/>Fork
                                this deck
                            </button>
                            <button className="ui button" tabIndex="0" onClick={this.handleCloseClick.bind(this)}><i className="remove icon"/>Close
                            </button>
                        </div>
                    </div>
                </div>
            </Portal>
        );
    }
}

NoPermissionsModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

NoPermissionsModal = connectToStores(NoPermissionsModal, [PermissionsStore], (context, props) => {
    return {
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default NoPermissionsModal;
