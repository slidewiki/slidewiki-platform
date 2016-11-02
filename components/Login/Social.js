import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ReactDOM from 'react-dom';
let classNames = require('classnames');

class Social extends React.Component {
    componentDidMount() {
        console.log('Social Login was called');

        //get data
        let data = this.findGetParameter('data');

        //save it
        localStorage.setItem('sociallogin_data', data);

        //close the tab
        window.close();
    }

    findGetParameter(parameterName) {
        let result = null,
            index = 0;
        location.search
        .substr(1)
            .split('&')
            .forEach((item) => {
                index = item.indexOf('=');
                if (item.substring(0, index) === parameterName) result = decodeURIComponent(item.substring(index+1));
            });
        return result;
    }

    render() {
        return (
            <div>
                <b>Work in progress</b>
            </div>
      );
    }
}

Social.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default Social;
