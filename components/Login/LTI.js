import React from 'react';
import {handleRoute} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
let classNames = require('classnames');

const NAME = 'ltilogin_data';

let queryData = '';

class LTI extends React.Component {

  constructor(props) {
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.signin = this.signin.bind(this);
      this.findGetParameter = this.findGetParameter.bind(this);
      this.state = {
          queryData: this.props.currentRoute.query.data
        };
      cookie.save("user_json_storage", this.state.queryData, {path: "/"});
    }

  componentWillMount() {
  console.log('Will be called on the server...')
}
    componentDidMount() {
        console.log('LTI. componentDidMount');
        /*
        //get data
        let data = this.findGetParameter('data');

        //save it
        if (data !== null && data !== undefined && data !== '') {
            localStorage.setItem(NAME, decodeURIComponent(data));

            //close the tab
            //window.close();
        }
        */

    }

    findGetParameter(parameterName) {
        console.log('parameterName='+this.state);
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

    signin() {
        //e.preventDefault();
        console.log('clicked');
    }

    render() {
        //console.log('LTILogin.render called. queryData='+this.state.queryData);
        console.log('LTILogin.render called.');
        return (
            <div>

                Welcome to LTI Login.

                Go to homepage <a href="http://localhost:3000">here</a> to proceed
                Click <a href="#" onClick={this.signin}>Yellow</a> to stay.

                Please click <a target="_blank" href={"/ltiLogin2?data="+this.state.queryData}>here</a> to proceed
            </div>
        );
    }
}



LTI.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
LTI = handleRoute(LTI);
export default LTI;
