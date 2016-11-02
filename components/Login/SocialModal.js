import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import userSignIn from '../../actions/user/userSignIn';
import userSignOut from '../../actions/user/userSignOut';
import UserProfileStore from '../../stores/UserProfileStore';
import HeaderDropdown from './HeaderDropdown.js';
import ReactDOM from 'react-dom';
import {hashPassword} from '../../configs/general';
let classNames = require('classnames');

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class SocialModal extends React.Component {
    isModalShown() {
        const classes = $('.ui.sociallogin.modal').attr('class');
        return classes.indexOf('hidden') === -1;
    }

    onLoad(e) {
        console.log('Social iframe loaded', e);
    }

    render() {
        return (
            <div>
                <div className="ui sociallogin modal" id='signinModalSocial' style={modalStyle}>
                  <div className="header">
                      <h1 style={headerStyle}>Sign In with {this.props.provider}</h1>
                  </div>
                  <div className="content">
                  <iframe id="iframe_social_login" src={this.props.url} width="100%" height="100%" frameBorder="1" onLoad={this.onLoad.bind(this)} ></iframe>
                  </div>
                  <div className="actions">
                    <button type="cancel" className="ui cancel button">
                      <i className="remove icon"/>Close
                    </button>
                  </div>
                </div>
            </div>
      );
    }
}

SocialModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SocialModal = connectToStores(SocialModal, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default SocialModal;
