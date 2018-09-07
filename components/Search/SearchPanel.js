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
import { isEmpty, pickBy, isArray } from 'lodash';
import querystring from 'querystring';
import Responsive from 'react-responsive';
import KeywordsInputWithFilter from './AutocompleteComponents/KeywordsInputWithFilter';
import SpellcheckPanel from './SearchResultsPanel/SpellcheckPanel';
import { Divider } from 'semantic-ui-react';

const Default = (props) => <Responsive {...props} minWidth={768} />;
const Mobile = (props) => <Responsive {...props} maxWidth={767} />;

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
    handleFacetClick(facetItem) {
        const facetField = facetItem.field;
        const facetValue = facetItem.value;
        let facetFieldValue = [];

        if (facetField in this.state) {
            if (this.state[facetField].includes(facetValue)) {
                facetFieldValue = this.state[facetField].filter( (item) => item !== facetValue);
            } else {
                let facetFieldArray = this.state[facetField].slice();
                facetFieldArray.push(facetValue);
                facetFieldValue = facetFieldArray;
            }
        } else {
            facetFieldValue = [facetValue];
        }

        this.setState({
            ...this.state, 
            [facetField]: facetFieldValue,
            facet_exclude: facetField,
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

        this.setState(newState, () => {
            this.handleRedirect(null, 'facets');
        });
    }
    render() {      
        // let advanced_options= <div>
        // <div className="three fields">
        //     <div className="field">
        //         <label htmlFor="field"><FormattedMessage {...this.messages.searchFieldTitle} /></label>
        //         <select name='field' id='field' onChange={this.onChange.bind(this)} value={this.state.field} multiple='' className='ui fluid search dropdown' ref='field'>
        //           <option value=' '>{this.context.intl.formatMessage(this.messages.searchFieldPlaceholder)}</option>
        //           <option value='title'>{this.context.intl.formatMessage(this.messages.searchFieldOptionTitle)}</option>
        //           <option value='description'>{this.context.intl.formatMessage(this.messages.searchFieldOptionDescription)}</option>
        //           <option value='content'>{this.context.intl.formatMessage(this.messages.searchFieldOptionContent)}</option>
        //           <option value='speakernotes'>{this.context.intl.formatMessage(this.messages.searchFieldOptionSpeakernotes)}</option>
        //         </select>
        //     </div>

        //     <div className="field">
        //         <label htmlFor="kind"><FormattedMessage {...this.messages.entityFilterTitle} /></label>
        //         <select name='kind' id='kind' onChange={this.onChange.bind(this)} value={this.state.kind} multiple='' className='ui fluid search dropdown' ref='kind'>
        //           <option value=' '>{this.context.intl.formatMessage(this.messages.entityFilterPlaceholder)}</option>
        //           <option value='slide'>{this.context.intl.formatMessage(this.messages.entityFilterOptionSlide)}</option>
        //           <option value='deck'>{this.context.intl.formatMessage(this.messages.entityFilterOptionDeck)}</option>
        //         </select>
        //     </div>

        //     <div className="field">
        //         <label htmlFor="language"><FormattedMessage {...this.messages.languageFilterTitle} /></label>
        //         <select name='language' onChange={this.onChange.bind(this)} value={this.state.language} multiple='' id='language' className='ui fluid search dropdown' ref='language'>
        //           <option value=' '>{this.context.intl.formatMessage(this.messages.languageFilterPlaceholder)}</option>
        //           {translationLanguages.reduce((arr, curr) => { //<div className="menu">
        //               arr.push(<option value={curr} key={curr}>{getLanguageNativeName(curr)}</option>);
        //               return arr;
        //           }, [])}
        //         </select>
        //     </div>
        // </div>
        // <div className="two fields">
        //     <div className="field">
        //         <label htmlFor="users_input_field"><FormattedMessage {...this.messages.usersFilterTitle} /></label>
        //         <UsersInput ref='user' placeholder={this.context.intl.formatMessage(this.messages.usersFilterPlaceholder)} />
        //     </div>

        //     <div className="field">
        //         <label htmlFor="tags_input_field"><FormattedMessage {...this.messages.tagsFilterTitle} /></label>
        //         <TagsInput ref='tag' placeholder={this.context.intl.formatMessage(this.messages.tagsFilterPlaceholder)} />
        //     </div>

        // </div></div>;

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
