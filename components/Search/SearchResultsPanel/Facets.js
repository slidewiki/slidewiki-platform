import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Menu, Label }  from 'semantic-ui-react';
import { getLanguageName }  from '../../../common';

class Facets extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
        this.state = {
            activeItem: 'spam',
        };
    }
    getIntlMessages(){
        return defineMessages({
            relevanceSort: {
                id: 'Facets.header',
                defaultMessage: 'Filters'
            }, 
        });
    }
    handleFacetClick(e, { name }) {
        e.preventDefault();
        this.props.handleFacetClick(JSON.parse(name));
    }

    getLanguageName(languageCode) {
        let language = languageCode === undefined ? '' : getLanguageName(languageCode);
        return (language === '' ? 'English' : language);
    }
    getFacetItems(facetArray, facetField, selected) {
        return (facetArray || []).map( (item, index) => {
            // facets is a json array with the value as key and count as value e.g. {'en': 51}
            let key = Object.keys(item)[0];
            let value = item[key];
            let isActive = selected.includes(key);
            let labelColor = (isActive) ? 'blue' : 'grey';
            let name = { 
                field: facetField,
                value: key
            };

            return <Menu.Item key={`${facetField}_${index}`} name={ JSON.stringify(name) } active={ isActive } onClick={this.handleFacetClick.bind(this)} tabIndex="0">
                <Label color={ labelColor }>{ value }</Label>
                { this.getLanguageName(key) }
            </Menu.Item>;
        });
    }
    render() {
        const data = this.props.data;
        const selected = this.props.selectedFacets;
        const languageItems = this.getFacetItems(data.language, 'language', selected.languages);


        return (
            <div id="facets">
                <h4 className="ui header">Languages</h4>
                <Menu vertical>
                    { languageItems }
                </Menu>
            </div>
        );
    }
}

Facets.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default Facets;

