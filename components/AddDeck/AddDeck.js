import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AddDeckStore from '../../stores/AddDeckStore';
let ReactDOM = require('react-dom');

class AddDeck extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }
    render() {
        let outputDIV = '';
        return (
            <div className="ui container grid" ref="addDeck">
                {outputDIV}
            </div>
        );
    }
}


AddDeck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
AddDeck = connectToStores(AddDeck, [AddDeckStore], (context, props) => {
    return {
        AddDeckStore: context.getStore(AddDeckStore).getState()
    };
});
export default AddDeck;
