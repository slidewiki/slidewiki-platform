import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ReactDOM from 'react-dom';
import ReviseUser from './ReviseUser';
let classNames = require('classnames');
import updateSSOData from '../../actions/user/updateSSOData';
import {FormattedMessage, defineMessages} from 'react-intl';


const MODI = 'sso_modi';
const NAME = 'sso_data';

class MigrateUser extends React.Component {
    componentDidMount() {
        console.log('MigrateUser was called');

        //get data
        let data = this.findGetParameter('data');
        let json = {};

        try {
            json = JSON.parse(decodeURIComponent(data));
        } catch (e) {
            data = undefined;
        }

        //handle data
        if (data !== null && data !== undefined && data !== '') {

            console.log('Got data:', json);
            //do a login
            if (json.jwt) {
                localStorage.setItem(NAME, decodeURIComponent(data));

                //close the tab
                window.close();
            }
            //revise user data
            else {
                //open modal
                $(ReactDOM.findDOMNode(this.refs.modal.refs.wrappedElement.refs.ReviseUser_Modal)).modal({
                    closable  : false,
                    onDeny    : function(){
                        console.log('Modal closed');
                        swal({
                            title: this.context.intl.formatMessage({
                                id: 'Migrate.closed',
                                defaultMessage: 'Modal closed'
                            }),
                            text: this.context.intl.formatMessage({
                                id: 'Migrate.closed.text',
                                defaultMessage: 'The modal was closed. It is needed for completion, thus this page will be reloaded in order to show the modal again.'
                            }),
                            type: 'warning',
                            confirmButtonText: this.context.intl.formatMessage({
                                id: 'Migrate.confirm',
                                defaultMessage: 'Confirm'
                            }),
                            confirmButtonClass: 'negative ui button',
                            buttonsStyling: false
                        }).then(() => {location.reload();}).catch();


                        window.close();
                    }
                }).modal('show');
                this.context.executeAction(updateSSOData, json);
            }
        }
        else {
            swal({
                title: this.context.intl.formatMessage({
                    id: 'Migrate.error',
                    defaultMessage: 'Data Error'
                }),
                text: this.context.intl.formatMessage({
                    id: 'Migrate.error.text',
                    defaultMessage: 'There was an error with the URL data. Either you used the wrong URL or there was an implementation error. The window will be closed now.'
                }),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage({
                    id: 'Migrate.confirm',
                    defaultMessage: 'Confirm'
                }),
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            }).then(() => {
                try {
                    window.close();
                } catch (e) {
                    console.log('Window could not be closed.');
                }
            }).catch();
        }
    }

    findGetParameter(parameterName) {
        let result = null,
            index = 0;
        result = location.search
        .substr(1)
            .split('&')
            .map((item) => {
                index = item.indexOf('=');
                if (index > 0 && item.substring(0, index) === parameterName)
                    return item.substring(index+1);
            })
            .reduce((prev, item) => {return item;}, '');

        //handle #
        index = result.lastIndexOf('}#');
        if (index > result.length - 12)
            result = result.substring(0, result.lastIndexOf('}#') + 1);

        return result;
    }

    render() {
        return (
            <div>
                <b><FormattedMessage id="Migrate.text1" defaultMessage="We are merging your user account. This will take just a few seconds."/>
                <br/>
                <FormattedMessage id="Migrate.text1" defaultMessage="You will be directed to next view."/>
                </b>
                <ReviseUser ref='modal' hash={this.hash} />
            </div>
        );
    }
}

MigrateUser.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
export default MigrateUser;
