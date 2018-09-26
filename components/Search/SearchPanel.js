import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { navigateAction } from 'fluxible-router';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../stores/SearchResultsStore';
import SearchParamsStore from '../../stores/SearchParamsStore';
import ErrorStore from '../../stores/ErrorStore';
import SearchResultsPanel from './SearchResultsPanel/SearchResultsPanel';
import loadSearchResults from '../../actions/search/loadSearchResults';
import UsersInput from './AutocompleteComponents/UsersInput';
import TagsInput from './AutocompleteComponents/TagsInput';
import KeywordsInput from './AutocompleteComponents/KeywordsInput';
import loadMoreResults from '../../actions/search/loadMoreResults';
import {FormattedMessage, defineMessages} from 'react-intl';
import {translationLanguages, getLanguageNativeName} from '../../common';

let MediaQuery = require ('react-responsive');

class SearchPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            keywords: this.props.SearchParamsStore.keywords,
            kind: this.props.SearchParamsStore.kind,
            language: this.props.SearchParamsStore.language,
            field: this.props.SearchParamsStore.field,
            user: this.props.SearchParamsStore.user,
            tag: this.props.SearchParamsStore.tag,
            sort: this.props.SearchParamsStore.sort,
        };
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
            }

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
        // TODO: find a more elegant way to do this!
        if(!nextProps.SearchParamsStore.fetch) return;
        this.setState(nextProps.SearchParamsStore);
    }
    onChange(event) {
        // console.log(event.target.name + ' -> \"' + event.target.value + '"');
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
        });

        this.handleRedirect();
    }
    handleRedirect(params){

        // form the query parameters to send to search service
        let keywords;
        if(params && params.keywords){
            keywords = params.keywords;
        } else {
            keywords = ((this.state.keywords) ? this.state.keywords : '*:*');
        }

        let queryparams = `keywords=${encodeURIComponent(keywords)}`;

        if(this.state.field && this.state.field.trim()){
            queryparams += `&field=${this.state.field}`;
        }

        if(this.state.kind && this.state.kind.trim()){
            queryparams += `&kind=${this.state.kind}`;
        }

        if(this.state.language && this.state.language.trim()){
            queryparams += `&language=${this.state.language}`;
        }

        let users = this.refs.user.getSelected();
        if(users){
            queryparams += users.split(',').map( (u) => { return `&user=${u}`; }).join('');
        }

        let tags = this.refs.tag.getSelected();
        if(tags){
            queryparams += tags.split(',').map( (t) => { return `&tag=${t}`; }).join('');
        }

        if(this.state.sort){
            queryparams += `&sort=${this.state.sort}`;
        }

        // redirect with query params
        this.context.executeAction(navigateAction, {
            url: `/search/${queryparams}`
        });

        this.refs.keywords.blur();

        return false;
    }
    changeSort(_sort){
        this.setState({
            sort: _sort
        });

        this.handleRedirect();
    }
    loadMore(){
        let nextPage = this.props.SearchResultsStore.page + 1;

        this.context.executeAction(loadMoreResults, {
            queryparams: `${this.props.SearchParamsStore.queryparams}&page=${nextPage}`
        });
    }
    render() {

        let loadingDiv = <div className="ui basic segment">
            <div className="ui active text loader">Loading</div>
        </div>;

        let errorDiv = <div className="ui grid centered">
            <h3>An error occured while fetching search results</h3>
        </div>;

        let searchResultsDiv='';

        if(this.props.SearchResultsStore.error){
            searchResultsDiv = errorDiv;
        }
        else if(this.props.SearchResultsStore.loading){
            searchResultsDiv = loadingDiv;
        }
        else if(this.props.SearchParamsStore.queryparams){
            searchResultsDiv = <SearchResultsPanel
                results={this.props.SearchResultsStore.docs}
                spellcheck={this.props.SearchResultsStore.spellcheck}
                numFound={this.props.SearchResultsStore.numFound}
                sort={this.props.SearchParamsStore.sort}
                handleRedirect={this.handleRedirect.bind(this)}
                changeSort={this.changeSort.bind(this)}
                hasMore={this.props.SearchResultsStore.hasMore}
                loadMore={this.loadMore.bind(this)}
                loadMoreLoading={this.props.SearchResultsStore.loadMoreLoading}

            />;
        }

        let advanced_options= <div>
        <div className="three fields">
            <div className="field">
                <label htmlFor="field"><FormattedMessage {...this.messages.searchFieldTitle} /></label>
                <select name='field' id='field' onChange={this.onChange.bind(this)} value={this.state.field} multiple='' className='ui fluid search dropdown' ref='field'>
                  <option value=' '>{this.context.intl.formatMessage(this.messages.searchFieldPlaceholder)}</option>
                  <option value='title'>{this.context.intl.formatMessage(this.messages.searchFieldOptionTitle)}</option>
                  <option value='description'>{this.context.intl.formatMessage(this.messages.searchFieldOptionDescription)}</option>
                  <option value='content'>{this.context.intl.formatMessage(this.messages.searchFieldOptionContent)}</option>
                  <option value='speakernotes'>{this.context.intl.formatMessage(this.messages.searchFieldOptionSpeakernotes)}</option>
                </select>
            </div>

            <div className="field">
                <label htmlFor="kind"><FormattedMessage {...this.messages.entityFilterTitle} /></label>
                <select name='kind' id='kind' onChange={this.onChange.bind(this)} value={this.state.kind} multiple='' className='ui fluid search dropdown' ref='kind'>
                  <option value=' '>{this.context.intl.formatMessage(this.messages.entityFilterPlaceholder)}</option>
                  <option value='slide'>{this.context.intl.formatMessage(this.messages.entityFilterOptionSlide)}</option>
                  <option value='deck'>{this.context.intl.formatMessage(this.messages.entityFilterOptionDeck)}</option>
                </select>
            </div>

            <div className="field">
                <label htmlFor="language"><FormattedMessage {...this.messages.languageFilterTitle} /></label>
                <select name='language' onChange={this.onChange.bind(this)} value={this.state.language} multiple='' id='language' className='ui fluid search dropdown' ref='language'>
                  <option value=' '>{this.context.intl.formatMessage(this.messages.languageFilterPlaceholder)}</option>
                  {translationLanguages.reduce((arr, curr) => { //<div className="menu">
                      arr.push(<option value={curr} key={curr}>{getLanguageNativeName(curr)}</option>);
                      return arr;
                  }, [])}
                </select>
            </div>
        </div>
        <div className="two fields">
            <div className="field">
                <label htmlFor="users_input_field"><FormattedMessage {...this.messages.usersFilterTitle} /></label>
                <UsersInput ref='user' placeholder={this.context.intl.formatMessage(this.messages.usersFilterPlaceholder)} />
            </div>

            <div className="field">
                <label htmlFor="tags_input_field"><FormattedMessage {...this.messages.tagsFilterTitle} /></label>
                <TagsInput ref='tag' placeholder={this.context.intl.formatMessage(this.messages.tagsFilterPlaceholder)} />
            </div>

        </div></div>;
        return (
            <div className="ui container" ref="searchPanel">
                <div className='advancedSearch'>
                    <div className="ui content">
                        <h2 className="ui header" style={{marginTop: '1em'}}><FormattedMessage {...this.messages.header} /></h2>
                        <form className="ui form success">
                            <div className="field">
                                <label htmlFor="SearchTerm"><FormattedMessage {...this.messages.searchTerm} /></label>
                                <KeywordsInput ref='keywords' onSelect={this.onSelect.bind(this)} onChange={this.onChange.bind(this)} handleRedirect={this.handleRedirect.bind(this)} value={decodeURIComponent(this.state.keywords)} placeholder={this.context.intl.formatMessage(this.messages.keywordsInputPlaceholder)} clearInputHandler={this.clearInput.bind(this)}/>
                            </div>
                            <MediaQuery minDeviceWidth={768}>
                                {advanced_options}
                            </MediaQuery>
                            <MediaQuery maxDeviceWidth={767}>
                            <div className="ui accordion">
                                <div className="title active">
                                  <i className="icon dropdown"></i>
                                  Advanced Options
                                </div>
                                <div className="content field">
                                    {advanced_options}
                                </div>
                            </div>
                            </MediaQuery>
                            <div role="button"  className="ui primary submit button" tabIndex="0" onClick={this.handleRedirect.bind(this)}>
                                 <FormattedMessage {...this.messages.submitButton} />
                            </div>

                        </form>

                    </div>

                </div>
                <br/>
                <div className='searchResults'>
                    {searchResultsDiv}
                </div>
            </div>
        );
    }
}

SearchPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};

SearchPanel = connectToStores(SearchPanel, [SearchResultsStore, SearchParamsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState(),
        SearchParamsStore: context.getStore(SearchParamsStore).getState()
    };
});

export default SearchPanel;
