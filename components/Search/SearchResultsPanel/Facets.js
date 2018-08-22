import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages } from 'react-intl';

class Facets extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            relevanceSort: {
                id: 'Facets.header',
                defaultMessage: 'Filters'
            }, 
        });
    }
    render() {
        return (
            <div id="facets">
                {JSON.stringify(this.props.data)}
            </div>
        );
    }
}

Facets.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default Facets;

