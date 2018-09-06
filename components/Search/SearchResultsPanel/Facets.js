import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Menu, Label, Icon, Container }  from 'semantic-ui-react';
import { getLanguageName }  from '../../../common';
import { isEmpty } from 'lodash';
import { NavLink } from 'fluxible-router';

class Facets extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
        this.state = {
            expanded: [],
        };
    }
    getIntlMessages(){
        return defineMessages({
            languagesFacet: {
                id: 'Facets.languagesFacet',
                defaultMessage: 'Languages'                
            },
            ownersFacet: {
                id: 'Facets.ownersFacet',
                defaultMessage: 'Owners'                
            }, 
            tagsFacet: {
                id: 'Facets.tagsFacet',
                defaultMessage: 'Tags'  
            },
            showMore: {
                id: 'Facets.showMore',
                defaultMessage: 'show more'                 
            },
            showLess: {
                id: 'Facets.showLess',
                defaultMessage: 'show less'                 
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
    handleKeyPress(name, event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.props.handleFacetClick(JSON.parse(name));
        }
    }
    clearFacets(fieldName, e) {
        e.preventDefault();
        this.props.clearFacets(fieldName);
    }
    handleShowMoreFacets(facetField) {
        let expanded;
        if (this.state.expanded.includes(facetField)) {
            expanded = this.state.expanded.filter( (f) => f !== facetField);
        } else {
            expanded = [
                ...this.state.expanded, 
                facetField
            ];
        }

        this.setState({
            expanded
        });
    }
    handleShowMoreFacetsKeyPress(facetField, event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleShowMoreFacets(facetField);
        }
    }
    getFacetItems(facetArray, facetField, selected) {

        let hasMore = (facetArray.length > 5);
        let isExpanded = this.state.expanded.includes(facetField);

        if (hasMore && !isExpanded) {
            facetArray = facetArray.slice(0, 5);
        }

        let facetItems = facetArray.map( (item, index) => {
            let isActive = selected.includes(item.val);
            let labelColor = (isActive) ? 'blue' : 'grey';
            let name = JSON.stringify({ 
                field: facetField,
                value: item.val
            });

            let facetText;
            if (facetField === 'language') {
                facetText = this.getLanguageName(item.val);
            } else if (facetField === 'user') {
                facetText = item.user.displayName;
            } else if (facetField === 'tag') {
                facetText = item.defaultName;
            }

            return <Menu.Item key={`${facetField}_${index}`} name={ name } active={ isActive } onClick={this.handleFacetClick.bind(this)} onKeyPress={this.handleKeyPress.bind(this, name)} tabIndex="0">
                <Label color={ labelColor }>{ item.rowCount }</Label>
                { facetText }
            </Menu.Item>;
        });

        if (hasMore) {
            let hasMoreText = (isExpanded) ? this.context.intl.formatMessage(this.messages.showLess): this.context.intl.formatMessage(this.messages.showMore);
            let hasMoreIcon = (isExpanded) ? <Icon name="angle up" aria-label={`show less ${facetField}s filters`}/> : <Icon name="angle down" aria-label={`show more ${facetField}s filters`}/>;
            facetItems.push(
                <Menu.Item key={`${facetField}_more_button`} onClick={this.handleShowMoreFacets.bind(this, facetField)} onKeyPress={this.handleShowMoreFacetsKeyPress.bind(this, facetField)} tabIndex="0">
                    <Container textAlign="center">
                        { hasMoreText } { hasMoreIcon }
                    </Container>
                </Menu.Item>
            );
        }

        return facetItems;
    }
    render() {
        const data = this.props.data;
        const selected = this.props.selectedFacets;
        const languageItems = this.getFacetItems(data.language, 'language', selected.languages);
        const userItems = this.getFacetItems(data.creator, 'user', selected.users);
        const tagItems = this.getFacetItems(data.tags, 'tag', selected.tags);

        return (
            <div id="facets">

                {
                    (languageItems.length > 0) &&
                        <Menu vertical>
                            <Menu.Item key="languagesFacetHeader" header>{this.context.intl.formatMessage(this.messages.languagesFacet)} { (!isEmpty(selected.languages)) ? <span  style={{float: 'right'}}><NavLink href="#" onClick={this.clearFacets.bind(this, 'language')}><Icon name="cancel" aria-label="clear languages"/></NavLink></span> : ''}</Menu.Item>
                            { languageItems }
                        </Menu>
                }

                {
                    (userItems.length > 0) &&
                        <Menu vertical>
                            <Menu.Item key="userFacetHeader" header>{this.context.intl.formatMessage(this.messages.ownersFacet)} { (!isEmpty(selected.users)) ? <span  style={{float: 'right'}}><NavLink href="#" onClick={this.clearFacets.bind(this, 'user')}><Icon name="cancel" aria-label="clear users"/></NavLink></span> : ''}</Menu.Item>
                            { userItems }
                        </Menu>
                }

                {
                    (tagItems.length > 0) && 
                        <Menu vertical>
                            <Menu.Item key="tagFacetHeader" header>{this.context.intl.formatMessage(this.messages.tagsFacet)} { (!isEmpty(selected.tags)) ? <span  style={{float: 'right'}}><NavLink href="#" onClick={this.clearFacets.bind(this, 'tag')}><Icon name="cancel" aria-label="clear tags"/></NavLink></span> : ''}</Menu.Item>
                            { tagItems }
                        </Menu>
                }
            </div>
        );
    }
}

Facets.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default Facets;

