import React from 'react';
import { NavLink } from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

class AddDeckPanel extends React.Component {
    componentDidMount() {
    }
    componentDidUpdate(){
    }
    render() {
        return (
            <button className="ui right labeled icon button">
                <i className="right plus icon"></i>
                Add deck
            </button>
        );
    }
}

AddDeckPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default AddDeckPanel;
