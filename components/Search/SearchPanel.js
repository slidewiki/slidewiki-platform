import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { navigateAction } from 'fluxible-router';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../stores/SearchResultsStore';
import ErrorStore from '../../stores/ErrorStore';
import SearchResultsPanel from './SearchResultsPanel/SearchResultsPanel';
import loadSearchResults from '../../actions/search/loadSearchResults';
import UsersInput from './AutocompleteComponents/UsersInput';
import TagsInput from './AutocompleteComponents/TagsInput';
import KeywordsInput from './AutocompleteComponents/KeywordsInput';
import loadMoreResults from '../../actions/search/loadMoreResults';
import {FormattedMessage, defineMessages} from 'react-intl';
import {translationLanguages, getLanguageNativeName} from '../../common';
import { isEmpty, pick, pickBy, isArray, filter } from 'lodash';
import querystring from 'querystring';
import KeywordsInputWithFilter from './AutocompleteComponents/KeywordsInputWithFilter';
import SpellcheckPanel from './SearchResultsPanel/SpellcheckPanel';
import { Divider } from 'semantic-ui-react';

class SearchPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = Object.assign({}, this.props.SearchResultsStore.queryparams);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            header: {
                id: 'SearchPanel.header',
                defaultMessage: 'Search'
            },
            searchTerm: {
                id: 'SearchPanel.searchTerm',
                defaultMessage: 'Search Term'
            },
            keywordsInputPlaceholder: {
                id: 'SearchPanel.KeywordsInput.placeholder',
                defaultMessage: 'Type your keywords here'
            },
            searchFieldTitle: {
                id: 'SearchPanel.filters.searchField.title',
                defaultMessage: 'Search Field'
            },
            searchFieldPlaceholder: {
                id: 'SearchPanel.filters.searchField.placeholder',
                defaultMessage: 'Select Search Field'
            },
            searchFieldOptionTitle: {
                id: 'SearchPanel.filters.searchField.option.title',
                defaultMessage: 'Title'
            },
            searchFieldOptionDescription: {
                id: 'SearchPanel.filters.searchField.option.description',
                defaultMessage: 'Description'
            },
            searchFieldOptionContent: {
                id: 'SearchPanel.filters.searchField.option.content',
                defaultMessage: 'Content'
            },
            searchFieldOptionSpeakernotes: {
                id: 'SearchPanel.filters.searchField.option.speakernotes',
                defaultMessage: 'Speakernotes'
            },
            entityFilterTitle: {
                id: 'SearchPanel.filters.entity.title',
                defaultMessage: 'Entity'
            },
            entityFilterPlaceholder: {
                id: 'SearchPanel.filters.entity.placeholder',
                defaultMessage: 'Select Entity'
            },
            entityFilterOptionSlide: {
                id: 'SearchPanel.filters.entity.option.slide',
                defaultMessage: 'Slide'
            },
            entityFilterOptionDeck: {
                id: 'SearchPanel.filters.entity.option.deck',
                defaultMessage: 'Deck'
            },
            languageFilterTitle: {
                id: 'SearchPanel.filters.language.title',
                defaultMessage: 'Language'
            },
            languageFilterPlaceholder: {
                id: 'SearchPanel.filters.language.placeholder',
                defaultMessage: 'Select Language'
            },
            languageFilterOptionDutch: {
                id: 'SearchPanel.filters.language.option.dutch',
                defaultMessage: 'Dutch'
            },
            languageFilterOptionEnglish: {
                id: 'SearchPanel.filters.language.option.english',
                defaultMessage: 'English'
            },
            languageFilterOptionGerman: {
                id: 'SearchPanel.filters.language.option.german',
                defaultMessage: 'German'
            },
            languageFilterOptionGreek: {
                id: 'SearchPanel.filters.language.option.greek',
                defaultMessage: 'Greek'
            },
            languageFilterOptionItalian: {
                id: 'SearchPanel.filters.language.option.italian',
                defaultMessage: 'Italian'
            },
            languageFilterOptionPortuguese: {
                id: 'SearchPanel.filters.language.option.portuguese',
                defaultMessage: 'Portuguese'
            },
            languageFilterOptionSerbian: {
                id: 'SearchPanel.filters.language.option.serbian',
                defaultMessage: 'Serbian'
            },
            languageFilterOptionSpanish: {
                id: 'SearchPanel.filters.language.option.spanish',
                defaultMessage: 'Spanish'
            },
            languageFilterOptionFrench: {
                id: 'SearchPanel.filters.language.option.french',
                defaultMessage: 'French'
            },
            languageFilterOptionLithuanian: {
                id: 'SearchPanel.filters.language.option.lithuanian',
                defaultMessage: 'Lithuanian'
            },
            usersFilterTitle: {
                id: 'SearchPanel.filters.users.title',
                defaultMessage: 'User'
            },
            usersFilterPlaceholder: {
                id: 'SearchPanel.filters.users.placeholder',
                defaultMessage: 'Select Users'
            },
            tagsFilterTitle: {
                id: 'SearchPanel.filters.tags.title',
                defaultMessage: 'Tags'
            },
            tagsFilterPlaceholder: {
                id: 'SearchPanel.filters.tags.placeholder',
                defaultMessage: 'Select Tags'
            },
            submitButton: {
                id: 'SearchPanel.button.submit',
                defaultMessage: 'Submit'
            },
        });
    }
    initDropdown(){
        $('#field').dropdown();
        $('#kind').dropdown();
        $('#language').dropdown();
    }
    componentDidMount(){
        this.initDropdown();
        $('.ui.accordion').accordion();
    }
    componentDidUpdate(){
        this.initDropdown();
    }
    componentWillReceiveProps(nextProps){
        if (this.props.SearchResultsStore.fetch) {
            // need to replace state here
            this.state = null;
            this.forceUpdate();
            this.setState(nextProps.SearchResultsStore.queryparams);
        }
    }
    onChange(event) {
        let curstate = {};
        curstate[event.target.name] = event.target.value;
        this.setState(curstate);
    }
    clearInput(){
        this.setState({keywords: ''});
        this.refs.keywords.focus();
    }
    onSelect(searchstring){
        this.setState({
            keywords: searchstring
        }, 
        this.handleRedirect);
    }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            event.preventDefault();
            this.keywordsInput.cancelAutocomplete();
            this.handleRedirect();
        }
    }
    handleRedirect(params, source){

        if (source !== 'facets') {
            this.setState({
                ...this.state, 
                language: [], 
                tag: [], 
                user: [], 
                facet_exclude: undefined,
            }, () => {
                this.handleSearch(params);
            });
        } else {
            this.handleSearch(params);
        }
        
        return false;
    }
    handleSearch(params){

        // pick from state the required fields
        let query = pickBy(this.state, (prop) => {
            return (isArray(prop)) ? !isEmpty(prop) : prop && prop.trim();
        });

        // needed for spellcheck suggestion
        if (params && params.keywords) {
            query.keywords = params.keywords;
        }

        query.keywords = (query.keywords) ? query.keywords : '';
        query.sort = query.sort || 'score';

        // redirect with query params
        this.context.executeAction(navigateAction, {
            url: `/search?${querystring.stringify(query)}`
        });

        this.keywordsInput.blur();
    }
    changeSort(_sort){
        this.setState({
            sort: _sort
        }, () => {
            // call handleRedirect, as coming from facets
            // so as not to clear filters
            this.handleRedirect(null, 'facets');
        });
    }
    loadMore(){
        this.context.executeAction(loadMoreResults, {
            nextLink: this.props.SearchResultsStore.links.next
        });
    }
    getSelectedFacetFields() {
        let fields = [];

        if (!isEmpty(this.state.language)) {
            fields.push('language');
        }

        if (!isEmpty(this.state.user)) {
            fields.push('user');
        }

        if (!isEmpty(this.state.tag)) {
            fields.push('tag');
        }

        return fields;
    }
    handleFacetClick(facetItem) {
        const facetField = facetItem.field;
        const facetValue = facetItem.value;
        let facetFieldValue = [];
        let facetExclude = [];

        if (facetField in this.state) {
            if (this.state[facetField].includes(facetValue)) {
                facetFieldValue = this.state[facetField].filter( (item) => item !== facetValue);
                facetExclude = this.getSelectedFacetFields();
            } else {
                let facetFieldArray = this.state[facetField].slice();
                facetFieldArray.push(facetValue);
                facetFieldValue = facetFieldArray;
                facetExclude = [facetField];
            }
        } else {
            facetFieldValue = [facetValue];
            facetExclude = [facetField];
        }

        this.setState({
            ...this.state, 
            [facetField]: facetFieldValue,
            facet_exclude: facetExclude,
        }, () => {
            this.handleRedirect(null, 'facets');
        });
    }
    clearFacets(fieldName='all') {
        let newState = {};
        if (fieldName === 'language' || fieldName === 'all') {
            newState.language = [];
        }

        if (fieldName === 'tag' || fieldName === 'all') {
            newState.tag = [];
        }

        if (fieldName === 'user' || fieldName === 'all') {
            newState.user = [];
        }

        newState.facet_exclude = this.getSelectedFacetFields();

        this.setState(newState, () => {
            this.handleRedirect(null, 'facets');
        });
    }
    render() {      
        return (
            <div className="ui container">
                <h2 className="ui header" style={{marginTop: '1em'}}><FormattedMessage {...this.messages.header} /></h2>
                <form className="ui form success">
                    <div className="field">
                        <KeywordsInputWithFilter ref={ (el) => { this.keywordsInput = el; }} value={this.state.keywords || ''} onSelect={this.onSelect.bind(this)} onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} placeholder={this.context.intl.formatMessage(this.messages.keywordsInputPlaceholder)} handleRedirect={this.handleRedirect.bind(this)} buttonText={this.context.intl.formatMessage(this.messages.submitButton)} fieldValue={this.state.field || ' '}/>

                    </div>
                </form>
                <Divider hidden />
                {
                    (!isEmpty(this.props.SearchResultsStore.spellcheck)) &&
                        <SpellcheckPanel spellcheckData={this.props.SearchResultsStore.spellcheck} handleRedirect={this.handleRedirect.bind(this)} />
                }
                { 
                    (!isEmpty(this.props.SearchResultsStore.queryparams)) &&
                        <SearchResultsPanel
                            results={this.props.SearchResultsStore.docs}
                            facets={this.props.SearchResultsStore.facets}
                            numFound={this.props.SearchResultsStore.numFound}
                            sort={this.props.SearchResultsStore.queryparams.sort}
                            handleRedirect={this.handleRedirect.bind(this)}
                            changeSort={this.changeSort.bind(this)}
                            hasMore={this.props.SearchResultsStore.hasMore}
                            loadMore={this.loadMore.bind(this)}
                            loadMoreLoading={this.props.SearchResultsStore.loadMoreLoading}
                            handleFacetClick={this.handleFacetClick.bind(this)}
                            selectedFacets={{
                                languages: this.state.language || [], 
                                tags: this.state.tag || [],
                                users: this.state.user || [],
                            }}
                            loading={this.props.SearchResultsStore.loading}
                            error={this.props.SearchResultsStore.error}
                            fromFacets={this.state.facet_exclude !== undefined}
                            clearFacets={this.clearFacets.bind(this)}
                        />
                }
            </div>
        );
    }
}

SearchPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};

SearchPanel = connectToStores(SearchPanel, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState(),
    };
});

export default SearchPanel;
