import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Menu, Label, Icon, Container, Input, But }  from 'semantic-ui-react';
import { getLanguageName }  from '../../../common';
import { isEmpty } from 'lodash';
import { NavLink } from 'fluxible-router';
import { debounce } from 'lodash';
// import loadFacetWithPrefix from '../../../actions/search/loadFacetWithPrefix';
import loadFacetsFilter from '../../../actions/search/loadFacetsFilter';

class Facets extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
        this.state = {
            expanded: [],
            showSearch: [],
        };
        // this.handleFacetPrefix = debounce(this.handleFacetPrefix.bind(this), 300);
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
    collapseFacets() {
        this.setState({
            expanded: [],
            showSearch: []
        });
    }
    handleFacetClick(e, { name }) {
        e.preventDefault();
        let data = JSON.parse(name);
        // this.handleShowFacetSearch(data.field, null);
        this.props.handleFacetClick(data);
        this.collapseFacets();
    }
    handleKeyPress(name, event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.props.handleFacetClick(JSON.parse(name));
            this.collapseFacets();
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

        let facetItems = facetArray.sort( (a, b) => {
            if (selected.includes(a.val) && !selected.includes(b.val)) {
                return -1;
            }

            if (!selected.includes(a.val) && selected.includes(b.val)) {
                return 1;
            }

            if (b.rowCount - a.rowCount !== 0) {
                return (b.rowCount - a.rowCount);
            }

            let aText = a.text.toLowerCase();
            let bText = b.text.toLowerCase();

            if (aText < bText) {
                return -1;
            }

            if (aText > bText) {
                return 1;
            }

            return 0;
        }).map( (item, index) => {
            let isActive = selected.includes(item.val);
            let labelColor = (isActive) ? 'blue' : 'grey';
            let name = JSON.stringify({ 
                field: facetField,
                value: item.val
            });

            return <Menu.Item disabled={this.props.loading} key={`${facetField}_${index}`} name={ name } active={ isActive } onClick={this.handleFacetClick.bind(this)} onKeyPress={this.handleKeyPress.bind(this, name)} tabIndex="0">
                <Label color={ labelColor }>{ item.rowCount }</Label>
                { item.text }
            </Menu.Item>;
        });

        let hasMore = (facetItems.length > 5);
        let isExpanded = this.state.expanded.includes(facetField);

        if (hasMore && !isExpanded) {
            facetItems = facetItems.slice(0, 5);
        }

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

        if (facetItems.length === 0) {
            facetItems = [
                <Menu.Item disabled={true} key={`no_tags_${facetField}`} active={false} tabIndex="0">
                    No facets available
                </Menu.Item>
            ];
        }

        return facetItems;
    }
    handleShowFacetSearch(facetField, e) {
        if (e) {
            e.preventDefault();
        }

        let op;
        let showSearch;
        if (this.state.showSearch.includes(facetField)) {
            showSearch = this.state.showSearch.filter( (f) => f !== facetField);
            op = 'delete';
            this.handleFacetsFilter(facetField, null, {
                name: facetField,
                value: '',
            });
        } else {
            showSearch = [
                ...this.state.showSearch, 
                facetField
            ];
            op = 'add';
        }

        this.setState({
            showSearch
        }, () => {
            if (op === 'add') {
                $(`#${facetField}_input`).focus();
            }
        });
    }
    // handleFacetPrefix(e, data) {
    //     this.context.executeAction(loadFacetWithPrefix, {
    //         request: this.props.request,
    //         facet_prefix_field: data.name,
    //         facet_prefix_value: data.value,
    //     });
    // }
    handleFacetsFilter(field, e, data){
        this.context.executeAction(loadFacetsFilter, {
            facetField: field,
            facetValue: data.value,
        });    
    }
    handleFacetsFilterKeyPress(field, e) {

        // escape button pressed
        if (e.keyCode === 27) {
            this.handleShowFacetSearch(field);
        }
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
                        <Menu fluid vertical>
                            <Menu.Item key="languagesFacetHeader" header>{this.context.intl.formatMessage(this.messages.languagesFacet)} <NavLink href="#" onClick={this.handleShowFacetSearch.bind(this, 'language')}><Icon name="search" /></NavLink>{ (!isEmpty(selected.languages) && !this.props.loading) ? <span  style={{float: 'right'}}><NavLink href="#" onClick={this.clearFacets.bind(this, 'language')}><Icon name="cancel" aria-label="clear languages"/></NavLink></span> : ''}</Menu.Item>
                            { (this.state.showSearch.includes('language')) && 
                                <Menu.Item>
                                    <Input id="language_input" name="user" placeholder='Search for users' onChange={this.handleFacetsFilter.bind(this, 'language')} onKeyDown={this.handleFacetsFilterKeyPress.bind(this, 'language')}/>
                                    </Menu.Item>
                            }
                            { languageItems }
                        </Menu>
                }

                {
                    (userItems.length > 0) &&
                        <Menu fluid vertical>
                            <Menu.Item key="userFacetHeader" header>{this.context.intl.formatMessage(this.messages.ownersFacet)} <NavLink href="#" onClick={this.handleShowFacetSearch.bind(this, 'creator')}><Icon name="search" /></NavLink>{ (!isEmpty(selected.users) && !this.props.loading) ? <span  style={{float: 'right'}}><NavLink href="#" onClick={this.clearFacets.bind(this, 'user')}><Icon name="cancel" aria-label="clear languages"/></NavLink></span> : ''}</Menu.Item>
                            { (this.state.showSearch.includes('creator')) && 
                                <Menu.Item>
                                    <Input id="creator_input" name="user" placeholder='Search for users' onChange={this.handleFacetsFilter.bind(this, 'creator')} onKeyDown={this.handleFacetsFilterKeyPress.bind(this, 'creator')}/>
                                    </Menu.Item>
                            }
                            { userItems }
                        </Menu>
                }

                {
                    <Menu fluid vertical>
                        <Menu.Item key="tagFacetHeader" header>{this.context.intl.formatMessage(this.messages.tagsFacet)} <NavLink href="#" onClick={this.handleShowFacetSearch.bind(this, 'tags')}><Icon name="search" /></NavLink>{ (!isEmpty(selected.tags) && !this.props.loading) ? <span  style={{float: 'right'}}><NavLink href="#" onClick={this.clearFacets.bind(this, 'tag')}><Icon name="cancel" aria-label="clear languages"/></NavLink></span> : ''}</Menu.Item>
                        { (this.state.showSearch.includes('tags')) && 
                            <Menu.Item>
                                <Input id="tags_input" name="tag" placeholder='Search for tags' onChange={this.handleFacetsFilter.bind(this, 'tags')} onKeyDown={this.handleFacetsFilterKeyPress.bind(this, 'tags')}/>
                                </Menu.Item>
                        }
                        { tagItems }
                    </Menu>
                }
            </div>
        );
    }
}

Facets.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
};

export default Facets;

