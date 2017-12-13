import React from 'react';
import ReactDOM from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import {publicRecaptchaKey} from '../../configs/general';
import SSOStore from '../../stores/SSOStore';
import ReCAPTCHA from 'react-google-recaptcha';
import {hashPassword} from '../../configs/general';
import instances from '../../configs/instances.js';
import SSOSingIn from '../../actions/user/SSOSingIn';
import {FormattedMessage, defineMessages} from 'react-intl';
import {Accordion, Icon} from 'semantic-ui-react';

const MODI = 'sso_modi';
const NAME = 'sso_data';

class SSO extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grecaptcharesponse: null,
            activeIndex: 0
        };

        this.errorMessages = defineMessages({
            error403: {
                id: 'SSOSignIn.errormessage.isSPAM',
                defaultMessage: 'Your account was marked as SPAM thus you are not able to sign in. Contact us directly for reactivation.'
            },
            error404: {
                id: 'SSOSignIn.errormessage.notFound',
                defaultMessage: 'The credentials are unknown. Please retry with another input.'
            },
            error423: {
                id: 'SSOSignIn.errormessage.deactivatedOrUnactivated',
                defaultMessage: 'Your user account either have to be activated via the activation link in your email or is deactivated in general.'
            }
        });
    }

    componentDidMount() {
        //Form validation
        const validationRules = {
            fields: {
                password: {
                    identifier: 'password',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a password'
                    }, {
                        type: 'minLength[8]',
                        prompt: 'Your password should contain 8 characters or more'
                    }]
                },
                recaptcha: {
                    identifier: 'recaptcha',
                    rules: [{
                        type: 'recaptcha',
                        prompt: 'Please verify that you are a human'
                    }]
                }
            },
            onSuccess: this.handleSignIn.bind(this)
        };

        // Custom form validation rule for checking if recaptcha is solved
        $.fn.form.settings.rules.recaptcha = (() => {
            return (this.state !== null && this.state.grecaptcharesponse !== undefined);
        });

        $(ReactDOM.findDOMNode(this.refs.SSO_form)).form(validationRules);

        if (this.props.SSOStore && !instances[this.props.SSOStore.instance]) {
            console.log('Wrong instance name:', this.props.SSOStore.instance);
            swal({
                title: 'Problem with the URL',
                text: 'The URL has to contain a valid instance shortcut. '+this.props.SSOStore.instance+' is an unknown shortcut.',
                type: 'error',
                confirmButtonText: 'Confirm',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then().catch();
        }
    }

    componentDidUpdate() {
        if (this.props.SSOStore.errorMessage.length > 2)
            $('.ui.form.ssosignin').form('add errors', [this.props.SSOStore.errorMessage]);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('changed jwt from to', this.props.SSOStore.jwt, nextProps.SSOStore.jwt);
        if (nextProps.SSOStore.jwt !== '' && nextProps.SSOStore.jwt !== this.props.SSOStore.jwt) {
            location.replace(instances[nextProps.SSOStore.instance].validate + '?instance=' + instances._self + '&jwt=' + encodeURIComponent(nextProps.SSOStore.jwt) + '&userid=' + nextProps.SSOStore.userid);
        }
    }

    handleSignIn(e) {
        e.preventDefault();

        if (!instances[this.props.SSOStore.instance])
            return;

        let data = {
            password: hashPassword(this.refs.password.value),
            grecaptcharesponse: this.state.grecaptcharesponse,
            email: this.props.SSOStore.email,
            errorMessages: {
                error403: this.context.intl.formatMessage(this.errorMessages.error403),
                error404: this.context.intl.formatMessage(this.errorMessages.error404),
                error423: this.context.intl.formatMessage(this.errorMessages.error423)
            }
        };

        this.context.executeAction(SSOSingIn, data);
        return false;
    }

    onRecaptchaChange(response) {
        this.setState({
            'grecaptcharesponse': response
        });
    }

    handleAccordionClick(e, titleProps) {
        e.preventDefault();

        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    render() {
        const signUpLabelStyle = {width: '150px'};
        const recaptchaStyle = {display: 'inline-block'};
        const PUBLIC_KEY = '6LdNLyYTAAAAAINDsVZRKG_E3l3Dvpp5sKboR1ET'; // Public reCAPTCHA key

        let url = '';
        let redirect = '';
        if (this.props.SSOStore && instances[this.props.SSOStore.instance]) {
            url = instances[this.props.SSOStore.instance].url;
            redirect = instances[this.props.SSOStore.instance].validate;
        }

        const { activeIndex } = this.state;

        return (
            <div>
                <div className="ui vertically padded centered grid container" >
                    <div className="ten wide column">
                        <div className="ui blue padded center aligned segment">
                            <div className="ui basic segment">
                              <img className="ui centered medium image" src="/assets/images/logo_full.png" />
                              <h2 className="ui header">SlideWiki Single Sign On</h2>
                            </div>
                            <div className="ui segments">
                              <div className="ui left aligned segment">
                                <p>
                                  SlideWiki wants to access your account on {instances[instances._self].url} in order to retrieve your account details to the SlideWiki on {url}.
                                  <br/>
                                  Beneath you have to enter your password and your account with the email {(this.props.SSOStore) ? this.props.SSOStore.email : ''} will be copied to {url}.
                                </p>
                              </div>
                              <div className="ui left aligned segment">

                                <Accordion>
                                  <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleAccordionClick.bind(this)}>
                                    <Icon name='dropdown' />
                                    Personal Account Data
                                  </Accordion.Title>
                                  <Accordion.Content active={activeIndex === 1}>
                                    The following details will be read and transfered:
                                    <br/>
                                    <ul className="ui list">
                                      <li>Username</li>
                                      <li>Email Address</li>
                                      <li>Full Name</li>
                                      <li>Country</li>
                                      <li>Picture</li>
                                      <li>Biography</li>
                                      <li>Organization</li>
                                      <li>Language</li>
                                    </ul>
                                  </Accordion.Content>
                                </Accordion>

                              </div>
                              <div className="ui segment">
                                <form className="ui form ssosignin" ref="SSO_form" >
                                    <div className="ui inline required field">
                                        <label style={signUpLabelStyle} htmlFor="password_label">Password</label>
                                        <div className="ui icon input"><input type="password" id="password_label" name="password" ref="password" placeholder="Password" aria-required="true"/></div>
                                    </div>
                                    <div >
                                        <input type="hidden" id="recaptcha" name="recaptcha"></input>
                                        <ReCAPTCHA style={recaptchaStyle} ref="recaptcha" sitekey={publicRecaptchaKey} onChange={this.onRecaptchaChange.bind(this)} aria-required="true"/>
                                    </div>
                                    <div className="ui error message" ></div>
                                    <br/>
                                    <button type="submit" className="ui blue labeled submit icon button" >
                                        <i className="icon add user"/> Sign In
                                    </button>
                                    <p><small>This will redirect you to<br/><b>{redirect}</b></small></p>
                                </form>
                              </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

SSO.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};
SSO = connectToStores(SSO, [SSOStore], (context, props) => {
    return {
        SSOStore: context.getStore(SSOStore).getState()
    };
});
export default SSO;
