import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ReactDOM from 'react-dom';
let classNames = require('classnames');

const NAME = 'ltilogin_data';

class LTI extends React.Component {
    componentDidMount() {
        console.log('LTI Login was called');

        //get data
        let data = this.findGetParameter('data');

        //save it
        if (data !== null && data !== undefined && data !== '') {
            localStorage.setItem(NAME, decodeURIComponent(data));

            //close the tab
            //window.close();
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

      console.log('LTI Login render');
        return (
            <div>
                <b>LTIModule. We acquire your data. This will take just a few seconds.<br/>This window will close automatically.</b>
            </div>
        );
    }
}

LTI.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default LTI;
