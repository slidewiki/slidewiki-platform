import React from 'react';
import { NavLink } from 'fluxible-router';
import DeckPageStore from '../../../stores/DeckPageStore';

class ErrorComponent extends React.Component {
    let deckIdError = this.props.DeckPageStore.error ? this.props.DeckPageStore.error.msg : 0;

    render() {
        return (
            <div>
                <p>Error!. TODO:Add appropriate CSS and message.</p>
                </div>
            </div>
        );
    }
}

export default ErrorComponent;
