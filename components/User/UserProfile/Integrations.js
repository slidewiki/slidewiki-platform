import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import addProvider from '../../../actions/user/userprofile/addProvider';
import removeProvider from '../../../actions/user/userprofile/removeProvider';
import resetProviderStuff from '../../../actions/user/userprofile/resetProviderStuff';
import newSocialData from '../../../actions/user/registration/newSocialData';
import updateProviderAction from '../../../actions/user/userprofile/updateProviderAction';
import common from '../../../common';
import { FormattedMessage, defineMessages } from 'react-intl';
import {Microservices} from '../../../configs/microservices';
import { NavLink } from 'fluxible-router';

import UserProfileStore from '../../../stores/UserProfileStore';



const MODI = 'sociallogin_modi';
const NAME = 'sociallogin_data';

class Integrations extends React.Component {
    constructor(props){
        super(props);
        this.provider = '';
    }

    componentDidUpdate() {
        const messages = defineMessages({
            swalTitle3: {
                id: 'Integration.swalTitle3',
                defaultMessage: 'Error',
            },
            swalText3: {
                id: 'Integration.swalText3',
                defaultMessage: 'The provider hasn\'t been disabled, because something unexpected happened. Please try again later.',
            },
            swalbutton3: {
                id: 'Integration.swalbutton3',
                defaultMessage: 'Confirmed',
            },
            swalText4: {
                id: 'Integration.swalText4',
                defaultMessage: 'The provider hasn\'t been added, because something unexpected happened. Please try again later.',
            },
            swalText5: {
                id: 'Integration.swalText5',
                defaultMessage: 'The provider you wanted to add is already assigned to another user. Do you have another user account at SlideWiki?',
            },
            swalTitle5: {
                id: 'Integration.swalTitle5',
                defaultMessage: 'Duplication',
            }
        });
        if (this.props.removeProviderError) {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle3),
                text: this.context.intl.formatMessage(messages.swalText3),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(messages.swalbutton3),
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then(() => {
                this.context.executeAction(resetProviderStuff, {});
                return true;
            }).catch();
        }
        else if (this.props.addProviderError) {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle3),
                text: this.context.intl.formatMessage(messages.swalText4),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(messages.swalbutton3),
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then(() => {
                return true;
            }).catch();
            this.context.executeAction(resetProviderStuff, {});
        }
        else if (this.props.addProviderAlreadyUsedError) {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle5),
                text: this.context.intl.formatMessage(messages.swalText5),
                type: 'warning',
                confirmButtonText: this.context.intl.formatMessage(messages.swalbutton3),
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then(() => {
                return true;
            }).catch();
            this.context.executeAction(resetProviderStuff, {});
        }
    }

    handleEnable(e) {
        console.log('handleEnable', e.currentTarget.attributes[1].nodeValue);
        e.preventDefault();

        if (this.props.providerAction) {
            //do nothing
            return;
        }

        this.provider = e.currentTarget.attributes[1].nodeValue;

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
        const messages = defineMessages({
            swalTitle2: {
                id: 'Integration.swalTitle2',
                defaultMessage: 'Error',
            },
            swalText2: {
                id: 'Integration.swalText2',
                defaultMessage: 'You are not allowed to disable all providers.',
            },
            swalbutton2: {
                id: 'Integration.swalbutton2',
                defaultMessage: 'Confirmed',
            }
        });
        console.log('handleDisable', e.currentTarget.attributes[1].nodeValue);
        e.preventDefault();

        if (this.props.providerAction) {
            //do nothing
            return;
        }

        this.provider = e.currentTarget.attributes[1].nodeValue;

        this.context.executeAction(updateProviderAction, 'disable_' + this.provider);

        if (this.props.providers.length === 1 && this.props.hasPassword === false) {
            swal({
                title: this.context.intl.formatMessage(messages.swalTitle2),
                text: this.context.intl.formatMessage(messages.swalText2),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(messages.swalbutton2),
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
        const messages = defineMessages({
            swalTitle1: {
                id: 'Integration.swalTitle1',
                defaultMessage: 'Error',
            },
            swalText1: {
                id: 'Integration.swalText1',
                defaultMessage: 'The data from {provider} was incomplete. In case you want to use this provider, please add an e-mail address at the provider itself and try again at SlideWiki.',
            },
            swalbutton1: {
                id: 'Integration.swalbutton1',
                defaultMessage: 'Confirm',
            }
        });
        console.log('storage event', e.key, localStorage.getItem(e.key));
        console.log( localStorage.getItem(MODI),  localStorage.getItem(NAME));
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
        let language = common.getIntlLanguage();
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
                title: this.context.intl.formatMessage(messages.swalTitle1),
                text: this.context.intl.formatMessage(messages.swalText1, {provider: provider}),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(messages.swalbutton1),
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
        const messages = defineMessages({
            text_providerEnabled: {
                id: 'Integration.text_providerEnabled',
                defaultMessage: 'This provider is enabled.',
            },
            text_providerDisabled: {
                id: 'Integration.text_providerDisabled',
                defaultMessage: 'This provider is currently disabled.',
            }
        });
        let facebook = false, google = false, github = false;
        if (this.props.providers)
            this.props.providers.forEach((provider) => {
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

        let text_providerEnabled = this.context.intl.formatMessage(messages.text_providerEnabled);
        let text_providerDisabled = this.context.intl.formatMessage(messages.text_providerDisabled);

        return (
          <div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h2  className="ui medium header" role="main" id="main">
                        <FormattedMessage
                          id='Integration.hint'
                          defaultMessage='Authorized Accounts and Services'
                        />
                      </h2>
                  </div>
                  <div className="ui segment">
                    <p>
                      <FormattedMessage
                        id='Integration.hintText'
                        defaultMessage='SlideWiki provides the possibility to sign in with multiple providers. In order to use a specific provider you have to enable the provider separately. Enabling a provider will open a new window for you to sign in. Please sign in. The window will close automatically once authorized.'
                      />
                    </p>
                  </div>

              </div>
              <div className="ui segments">



                  <div className="ui secondary segment">
                      <h3 className="ui medium header">
                        <FormattedMessage
                          id='Integration.loginProvider'
                          defaultMessage='Login Provider'
                        />
                      </h3>
                  </div>
                  <div className="ui segment">
                      <div className="ui three column vertically divided grid">
                        <div className="row">
                          <div className="one wide column">
                            <i className={google_icon_classes} aria-label="Google"></i>
                          </div>
                          <div className="ten wide column">
                            <div className="ui large label">
                              {(google) ? text_providerEnabled : text_providerDisabled}
                            </div>
                          </div>
                          <div className="two wide column">
                            {
                              (google) ? (
                                <button className={google_disable_classes} name="google" aria-label="Disable google" onClick={this.handleDisable.bind(this)} ><FormattedMessage id='Integration.disableGoogle' defaultMessage='Disable'/></button>
                              ) : (
                                <button className={google_enable_classes} name="google" aria-label="Enable google" onClick={this.handleEnable.bind(this)} ><FormattedMessage id='Integration.enableGoogle' defaultMessage='Enable'/></button>
                              )
                            }
                          </div>
                        </div>
                      </div>

                      <div className="ui three column vertically divided grid">
                        <div className="row">
                          <div className="one wide column">
                            <i className={github_icon_classes} aria-label="github" ></i>
                          </div>
                          <div className="ten wide column">
                            <div className="ui large label">
                              {(github) ? text_providerEnabled : text_providerDisabled}
                            </div>
                          </div>
                          <div className="two wide column">
                            {
                              (github) ? (
                                <button className={github_disable_classes} name="github" aria-label="disabled github" onClick={this.handleDisable.bind(this)} ><FormattedMessage id='Integration.disableGithub' defaultMessage='Disable'/></button>
                              ) : (
                                <button className={github_enable_classes} name="github" aria-label="enable github" onClick={this.handleEnable.bind(this)} ><FormattedMessage id='Integration.enableGithub' defaultMessage='Enable'/></button>
                              )
                            }
                          </div>
                        </div>
                      </div>
                      {(this.props.providerAction) ? <div className="ui active dimmer"><div className="ui text loader"><FormattedMessage id='Integration.loading' defaultMessage='loading'/></div></div> : ''}
                  </div>


              </div>


              <div className="ui segments">
                <div className="ui secondary segment">
                  <h3 className="ui medium header">
                    <FormattedMessage
                      id='Integration.ltis'
                      defaultMessage='Learning Services (LTIs)'
                    />
                  </h3>
                </div>
                <div className="ui segment">

                    <p>
                    <i className="icon big graduation cap"/>
                      <NavLink className="item" href={'/user/'+this.props.UserProfileStore.username+'/ltis/overview'} activeStyle={this.styles}>
                        <FormattedMessage
                          id='Integration.myLTIs'
                          defaultMessage=' My Learning Services'
                        />
                      </NavLink>
                    </p>

                </div>
              </div>




          </div>
        );
    }
}

Integrations.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

Integrations = connectToStores(Integrations, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default Integrations;
