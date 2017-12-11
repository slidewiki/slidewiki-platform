import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ReactDOM from 'react-dom';
import ReviseUser from './ReviseUser';
let classNames = require('classnames');

const MODI = 'sso_modi';
const NAME = 'sso_data';

class MigrateUser extends React.Component {
    constructor(props) {
        super(props);

        this.hash = '';
        this.email = '',
        this.username = '';
    }

    componentDidMount() {
        console.log('MigrateUser was called');

        //get data
        let data = this.findGetParameter('data');

        //handle data
        if (data !== null && data !== undefined && data !== '') {
            let json = JSON.parse(decodeURIComponent(data));
            //do a login
            if (json.jwt) {
                localStorage.setItem(NAME, decodeURIComponent(data));

                //close the tab
                window.close();
            }
            //revise user data
            else {
                this.hash = data.hash;
                this.email = data.email;
                this.username = data.email;
                //open modal
                $(ReactDOM.findDOMNode(this.refs.modal.refs.wrappedElement.refs.ReviseUser_Modal)).modal({
                    closable  : false,
                    onDeny    : function(){
                        console.log('Modal closed');
                        //TODO show hint


                        window.close();
                    }
                }).modal('show');
            }
        }
        else {
            //TODO show hint
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
                <b>We are merging your user account. This will take just a few seconds.<br/>You will be directed to next view.</b>
                <ReviseUser ref='modal' hash={this.hash} email={this.email} username={this.username} />
            </div>
        );
    }
}

MigrateUser.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default MigrateUser;
