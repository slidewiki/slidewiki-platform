import React from 'react';
import { NavLink } from 'fluxible-router';

class CategoryBox extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        let active = 'selected active blue';

        return (
            <div className="ui vertical fluid buttons">
                <NavLink className={ 'ui ' + ( this.props.toShow === 'decks' ? active : '' ) + ' button' } href={ '/user/' + this.props.username + '/decks'}>
                    <p><i className="icon folder"/> My Decks</p>
                </NavLink>
                <NavLink className={ 'ui ' + ( this.props.toShow === 'settings' ? active : '' ) + ' button' } href={ '/user/' + this.props.username + '/settings'}>
                    <p><i className="icon setting"/> Settings</p>
                </NavLink>
                <NavLink className={ 'ui ' + ( this.props.toShow === 'stats' ? active : '' ) + ' button' } href={ '/user/' + this.props.username + '/stats'}>
                    <p><i className="icon bar chart"/> My Stats</p>
                </NavLink>
            </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CategoryBox;
