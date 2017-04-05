import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import addProvider from '../../../actions/user/userprofile/addProvider';
import removeProvider from '../../../actions/user/userprofile/removeProvider';
import resetProviderStuff from '../../../actions/user/userprofile/resetProviderStuff';
import newSocialData from '../../../actions/user/registration/newSocialData';
import updateProviderAction from '../../../actions/user/userprofile/updateProviderAction';
import UserProfileStore from '../../../stores/UserProfileStore';
import common from '../../../common';
import {Microservices} from '../../../configs/microservices';

const MODI = 'sociallogin_modi';
const NAME = 'sociallogin_data';

class Integrations extends React.Component {
    constructor(props){
        super(props);

        this.provider = '';
    }

    componentWillReceiveProps(nextProps) {
        // console.log('Integrations componentWillReceiveProps()', nextProps.UserProfileStore.user.providers, this.props.UserProfileStore.user.providers);
        if (this.props.UserProfileStore.removeProviderError === false && nextProps.UserProfileStore.removeProviderError) {
            swal({
                title: 'Error',
                text: 'The provider hasn\'t been disabled, because something unexpected happened. Please try again later.',
                type: 'error',
                confirmButtonText: 'Confirmed',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then(() => {
                this.context.executeAction(resetProviderStuff, {});
                return true;
            }).catch();
        }
        else if (this.props.UserProfileStore.addProviderError === false && nextProps.UserProfileStore.addProviderError) {
            swal({
                title: 'Error',
                text: 'The provider hasn\'t been added, because something unexpected happened. Please try again later.',
                type: 'error',
                confirmButtonText: 'Confirmed',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then(() => {
                return true;
            }).catch();
            this.context.executeAction(resetProviderStuff, {});
        }
        else if (this.props.UserProfileStore.addProviderAlreadyUsedError === false && nextProps.UserProfileStore.addProviderAlreadyUsedError) {
            swal({
                title: 'Duplication',
                text: 'The provider you wanted to add is already assigned to another user. Do you have another user account at SlideWiki?',
                type: 'warning',
                confirmButtonText: 'Confirmed',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then(() => {
                return true;
            }).catch();
            this.context.executeAction(resetProviderStuff, {});
        }
    }

    componentDidUpdate() {
        // console.log('Integrations componentDidUpdate()', this.providers, this.props.UserProfileStore.user.providers);

    }

    handleEnable(e) {
        console.log('handleEnable', e.target.attributes[1].nodeValue);
        e.preventDefault();

        if (this.props.UserProfileStore.providerAction !== '') {
            //do nothing
            return;
        }

        this.provider = e.target.attributes[1].nodeValue;

        this.context.executeAction(updateProviderAction, 'enable_' + this.provider);

        //prepare localStorage
        localStorage.setItem(MODI, 'addProvider');
        localStorage.setItem(NAME, '');

        //observe storage
        $(window).off('storage').on('storage', this.handleStorageEvent.bind(this));

        //create new window
        let url = Microservices.user.uri + '/connect/' + this.provider;

        let width = screen.width*0.75, height = screen.height*0.75;
        if (width < 600)
            width = screen.width;
        if (height < 500)
            height = screen.height;
        let left = screen.width/2-width/2, topSpace = screen.height/2-height/2;

        let win = window.open(url, '_blank', 'width='+width+',height='+height+',left='+left+',top='+topSpace+',toolbar=No,location=No,scrollbars=no,status=No,resizable=no,fullscreen=No');
        win.focus();

        //handle close of window
        let thatContext = this.context;
        let timer = setInterval(() => {
            // console.log('Time for window - closed:', win.closed);
            if(win.closed) {
                clearInterval(timer);
                thatContext.executeAction(updateProviderAction, '');
            }
        }, 1400);
    }

    handleDisable(e) {
        console.log('handleDisable', e.target.attributes[1].nodeValue);
        e.preventDefault();

        if (this.props.UserProfileStore.providerAction !== '') {
            //do nothing
            return;
        }

        this.provider = e.target.attributes[1].nodeValue;

        this.context.executeAction(updateProviderAction, 'disable_' + this.provider);

        if (this.props.UserProfileStore.user.providers.length === 1 && this.props.UserProfileStore.user.hasPassword === false) {
            swal({
                title: 'Error',
                text: 'You are not allowed to disable all providers.',
                type: 'error',
                confirmButtonText: 'Confirmed',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then().catch();

            //just stop here
            this.context.executeAction(updateProviderAction, '');
            return;
        }

        //TODO show spinner


        this.context.executeAction(removeProvider, this.provider);
    }

    handleStorageEvent(e) {
        console.log('storage event', e.key, localStorage.getItem(e.key));
        //this is available

        if (e.key !== NAME || localStorage.getItem(MODI) !== 'addProvider')
            return false;

        let data = {};
        try {
            data = JSON.parse(localStorage.getItem(e.key));
        } catch (err) {
            console.log('Error while parsing data', err);
            this.context.executeAction(updateProviderAction, '');
            return false;
        }
        finally {
            //delete data
            localStorage.setItem(NAME, '');
        }

        //add language before send to service
        let language = common.getBrowserLanguage();
        if (language.length === 2) {
            language += '-' + language.toUpperCase();
        }
        data.language = language;

        //check data - valid and not empty
        if ( (data.token.length < 1)
          || (data.provider.length < 3)
          || (data.token_creation.length < 22) )
            //Failure
        {
            this.context.executeAction(updateProviderAction, '');
            return false;
        }

        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if  (!regex.test(data.email)) {
            //show hint
            const provider = this.getProviderName();
            swal({
                title: 'Error',
                text: 'The data from ' + provider + ' was incomplete. In case you want to use this provider, please add an e-mail address at the provider itself and try again at SlideWiki.',
                type: 'error',
                confirmButtonText: 'Confirm',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then().catch();
            this.context.executeAction(updateProviderAction, '');
            return false;
        }

        this.context.executeAction(newSocialData, data);
        this.context.executeAction(addProvider, data);

        return true;
    }

    getProviderName() {
        if (this.provider.length < 1)
            return '';
        return this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
    }

    render() {
        let facebook = false, google = false, github = false;
        if (this.props.UserProfileStore.user.providers)
            this.props.UserProfileStore.user.providers.forEach((provider) => {
                switch (provider) {
                    case 'facebook':
                        facebook = true;
                        break;
                    case 'google':
                        google = true;
                        break;
                    case 'github':
                        github = true;
                        break;
                }
            });
        // console.log('Integrations render()', this.props.UserProfileStore.user.providers);

        let facebook_icon_classes = classNames({
            'big': true,
            'facebook': true,
            'square': true,
            'disabled': !facebook,
            'icon': true,
        });
        let facebook_enable_classes = classNames({
            'ui': true,
            'positive': !facebook,
            'disabled': facebook,
            'button': true,
        });
        let facebook_disable_classes = classNames({
            'ui': true,
            'negative': facebook,
            'disabled': !facebook,
            'button': true,
        });
        let google_icon_classes = classNames({
            'big': true,
            'google': true,
            'plus': true,
            'disabled': !google,
            'icon': true,
        });
        let google_enable_classes = classNames({
            'ui': true,
            'positive': !google,
            'disabled': google,
            'button': true,
        });
        let google_disable_classes = classNames({
            'ui': true,
            'negative': google,
            'disabled': !google,
            'button': true,
        });
        let github_icon_classes = classNames({
            'big': true,
            'github': true,
            'disabled': !github,
            'icon': true,
        });
        let github_enable_classes = classNames({
            'ui': true,
            'positive': !github,
            'disabled': github,
            'button': true,
        });
        let github_disable_classes = classNames({
            'ui': true,
            'negative': github,
            'disabled': !github,
            'button': true,
        });

        let text_providerEnabled = 'This provider is enabled and you may use it.';
        let text_providerDisabled = 'This provider is currently disabled. To enable it, click on the button next to it.';

        return (
          <div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Hint</h3>
                  </div>
                  <div className="ui segment">
                    <p>
                      SlideWiki provides the possibility to sign in with multiple providers (new features will be added soon).
                      In order to use a specific provider you have to enable the provider separately.
                      Enabling a provider will open a new window for you to sign in.
                      Please sign in and don&apos;t close the opened window, as it will close automatically.
                    </p>
                  </div>

              </div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Login Provider</h3>
                  </div>
                  <div className="ui segment">
                      <div className="ui three column vertically divided grid">
                        <div className="row">
                          <div className="one wide column">
                            <i className={facebook_icon_classes} ></i>
                          </div>
                          <div className="ten wide column">
                            <div className="ui large label">
                              {(facebook) ? text_providerEnabled : text_providerDisabled}
                            </div>
                          </div>
                          <div className="two wide column">
                            {
                              (facebook) ? (
                                <button className={facebook_disable_classes} name="facebook" onClick={this.handleDisable.bind(this)} >Disable</button>
                              ) : (
                                <button className={facebook_enable_classes} name="facebook" onClick={this.handleEnable.bind(this)} >Enable</button>
                              )
                            }
                          </div>
                        </div>
                      </div>

                      <div className="ui three column vertically divided grid">
                        <div className="row">
                          <div className="one wide column">
                            <i className={google_icon_classes} ></i>
                          </div>
                          <div className="ten wide column">
                            <div className="ui large label">
                              {(google) ? text_providerEnabled : text_providerDisabled}
                            </div>
                          </div>
                          <div className="two wide column">
                            {
                              (google) ? (
                                <button className={google_disable_classes} name="google" onClick={this.handleDisable.bind(this)} >Disable</button>
                              ) : (
                                <button className={google_enable_classes} name="google" onClick={this.handleEnable.bind(this)} >Enable</button>
                              )
                            }
                          </div>
                        </div>
                      </div>

                      <div className="ui three column vertically divided grid">
                        <div className="row">
                          <div className="one wide column">
                            <i className={github_icon_classes} ></i>
                          </div>
                          <div className="ten wide column">
                            <div className="ui large label">
                              {(github) ? text_providerEnabled : text_providerDisabled}
                            </div>
                          </div>
                          <div className="two wide column">
                            {
                              (github) ? (
                                <button className={github_disable_classes} name="github" onClick={this.handleDisable.bind(this)} >Disable</button>
                              ) : (
                                <button className={github_enable_classes} name="github" onClick={this.handleEnable.bind(this)} >Enable</button>
                              )
                            }
                          </div>
                        </div>
                      </div>
                      {(this.props.UserProfileStore.providerAction !== '') ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                  </div>

              </div>
          </div>
        );
    }
}

Integrations.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Integrations = connectToStores(Integrations, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default Integrations;
