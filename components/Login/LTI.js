import PropTypes from 'prop-types';
import React from 'react';
import {handleRoute} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
let classNames = require('classnames');

const NAME = 'ltilogin_data';

let queryData = '';
let resource_id= '';

class LTI extends React.Component {

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            queryData: this.props.currentRoute.query.data,
            resource_id: this.props.currentRoute.query.resource_id
        };
        cookie.save('user_json_storage', this.state.queryData, {path: '/'});
    }

    componentWillMount() {
        console.log('Will be called on the server...');
    }
    componentDidMount() {
        console.log('LTI. componentDidMount');
        //console.log('LTI. componentDidMount.this.state.resource_Id='+this.state.resource_id);
        if(this.state.resource_id !== '' && this.state.resource_id >0) {
            this.context.executeAction(navigateAction, {
                url: '/deck/'+this.state.resource_id
            });
        }

    }

    render() {
        //console.log('LTILogin.render called.resource_id='+this.state.resource_id);
        return (
            <div>
                Welcome to LTI Login.
            </div>
        );
    }
}


LTI.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
LTI = handleRoute(LTI);
export default LTI;
