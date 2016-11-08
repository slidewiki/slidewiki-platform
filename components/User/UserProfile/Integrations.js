import React from 'react';
import classNames from 'classnames';
import addProvider from '../../../actions/user/userprofile/addProvider';
import removeProvider from '../../../actions/user/userprofile/removeProvider';

class Integrations extends React.Component {
    constructor(props){
        super(props);

        this.action = '';
    }

    handleEnable(e) {
        console.log('handleEnable', e.target);
    }

    handleDisable(e) {
        console.log('handleDisable', e.target.attributes[1].nodeValue);
        e.preventDefault();

        if (this.action !== '') {
            //do nothing
            return;
        }

        let provider = e.target.attributes[1].nodeValue;

        this.action = 'disable_' + provider;

        if (this.props.providers.length === 1 && this.props.hasPassword === false) {
            swal({
                title: 'Error',
                text: 'You are not allowed to disable all providers.',
                type: 'error',
                confirmButtonText: 'Confirmed',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then().catch();

            //just stop here
            this.action = '';
            return;
        }

        this.context.executeAction(removeProvider, provider);
    }

    render() {
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
        console.log('Integrations render()', this.props.providers);

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

        return (
          <div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Hint</h3>
                  </div>
                  <div className="ui segment">
                    <p>
                      SlideWiki provides the possibility to sign in with multiple providers.
                      In order to be able to use a specific provider you have to active it.
                      Activating a provider will open a new tab for a sign in there.
                      Please sign in there and don&apos;t close the tab.
                    </p>
                  </div>

              </div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Login Provider</h3>
                  </div>
                  <div className="ui segment">
                      <div>
                        <i className="big facebook square link icon" ></i>
                        &nbsp;&nbsp;&nbsp;
                        <div className="ui buttons">
                          <button className={facebook_enable_classes} onClick={this.handleEnable.bind(this)} >Enable</button>
                          <div className="or"></div>
                          <button className={facebook_disable_classes} onClick={this.handleDisable.bind(this)} >Disable</button>
                        </div>
                      </div>
                      <br/>
                      <div>
                        <i className="big google plus link icon" ></i>
                        &nbsp;&nbsp;&nbsp;
                        <div className="ui buttons">
                          <button className={google_enable_classes} onClick={this.handleEnable.bind(this)} >Enable</button>
                          <div className="or"></div>
                          <button className={google_disable_classes} name="google" onClick={this.handleDisable.bind(this)} >Disable</button>
                        </div>
                      </div>
                      <br/>
                      <div>
                        <i className="big github link icon" ></i>
                        &nbsp;&nbsp;&nbsp;
                        <div className="ui buttons">
                          <button className={github_enable_classes} onClick={this.handleEnable.bind(this)} >Enable</button>
                          <div className="or"></div>
                          <button className={github_disable_classes} onClick={this.handleDisable.bind(this)} >Disable</button>
                        </div>
                      </div>
                  </div>

              </div>
          </div>
        );
    }
}

Integrations.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Integrations;
