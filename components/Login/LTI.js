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
      this.state = {
          queryData: this.props.currentRoute.query.data
      };
      cookie.save('user_json_storage', this.state.queryData, {path: '/'});
  }

    componentWillMount() {
      console.log('Will be called on the server...');
  }
    componentDidMount() {
        console.log('LTI. componentDidMount');
  }

    render() {
        //console.log('LTILogin.render called. queryData='+this.state.queryData);
        console.log('LTILogin.render called.');
        return (
            <div>
                Welcome to LTI Login.
            </div>
        );
    }
}


LTI.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
LTI = handleRoute(LTI);
export default LTI;
