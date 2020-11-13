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
import { isEmpty, pick, pickBy, isArray, filter, uniq, map } from 'lodash';
import querystring from 'querystring';
import KeywordsInputWithFilter from './AutocompleteComponents/KeywordsInputWithFilter';
import SpellcheckPanel from './SearchResultsPanel/SpellcheckPanel';
import { educationLevels } from '../../lib/isced';
import {Dropdown, Divider, Button, Grid} from 'semantic-ui-react';
import TagInput from '../Deck/ContentModulesPanel/TagsPanel/TagInput';
import SingleItemAccordion from '../common/SingleItemAccordion';

class SearchPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = Object.assign({advanced_options_visible: false}, this.props.SearchResultsStore.queryparams);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            header: {
                id: 'SearchPanel.header',
                defaultMessage: 'Search SlideWiki'
            },
            searchTerm: {
                id: 'SearchPanel.searchTerm',
                defaultMessage: 'Search Term'
            },
            keywordsInputPlaceholder: {
                id: 'SearchPanel.KeywordsInput.placeholder',
                defaultMessage: 'Type your search terms here'
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
                defaultMessage: 'Owners'
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
            subject: {
                id: 'SearchPanel.subject',
                defaultMessage: 'Subject'
            },
            selectSubject: {
                id: 'SearchPanel.select.subject',
                defaultMessage: 'Select Subject'
            }
        });
    }
    initDropdown(){
        $('#languageDropdown').dropdown();
    }
    componentDidMount(){
        this.initDropdown();
    }
    componentDidUpdate(){
        this.initDropdown();
    }
    componentWillReceiveProps(nextProps){
        if (this.props.SearchResultsStore.fetch) {
            // need to replace state here
            //this.state = null;
            //this.forceUpdate();
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
    getAdvancedFilters() {
        let advancedFilters = {
            language: null,
            user: null,
            tag: null,
            educationLevel: null,
            topics: null,
            tag: null,
            facet_exclude: [],
        };

        let languageDropdown = document.getElementById('languageDropdown');
        let selectedLanguage = languageDropdown.options[languageDropdown.selectedIndex].value;

        if (selectedLanguage.trim() !== '') {
            advancedFilters.language = selectedLanguage;
            advancedFilters.facet_exclude.push('language');
            $('#languageDropdown').dropdown('set selected', ' ');
        }

        let users = this.userDropdown.getSelected();
        if(users){
            advancedFilters.user = users.split(',').map( (u) => parseInt(u));
            advancedFilters.facet_exclude.push('user');
            this.userDropdown.clear();
        }

        let tags = this.state.tag;
        if (tags) {
            advancedFilters.tag = tags;
            advancedFilters.facet_exclude.push('tag');
        }

        let educationLevel = this.educationLevelsDropdown.state.value;
        if (educationLevel) {
            advancedFilters.educationLevel = educationLevel;
            advancedFilters.facet_exclude.push('educationLevel');
            this.educationLevelsDropdown.setValue(null);
        }

        let topics = this.state.topics;
        if (!_.isEmpty(topics)) {
            advancedFilters.topics = topics;
            advancedFilters.facet_exclude.push('topics');
        }

        return advancedFilters;
    }
    applyAdvancedFilters(filters) {
        let newState = Object.assign({}, this.state);

        if (filters.language) {
            if (newState.language) {
                newState.language.push(filters.language);
                newState.language = uniq(newState.language);
            } else {
                newState.language = [filters.language];
            }
        }

        if (filters.user) {
            if (newState.user) {
                newState.user = newState.user.concat(filters.user);
                newState.user = uniq(newState.user);
            } else {
                newState.user = filters.user;
            }
        }

        if (filters.tag) {
            if (newState.tag) {
                newState.tag = newState.tag.concat(filters.tag);
                newState.tag = uniq(newState.tag);
            } else {
                newState.tag = filters.tag;
            }
        }

        if (filters.educationLevel) {
            if (newState.educationLevel) {
                newState.educationLevel = newState.educationLevel.concat(filters.educationLevel);
                newState.educationLevel = uniq(newState.educationLevel);
            } else {
                newState.educationLevel = filters.educationLevel;
            }
        }

        if (filters.topics) {
            if (newState.topics) {
                newState.topics = newState.topics.concat(filters.topics);
                newState.topics = uniq(newState.topics);
            } else {
                newState.topics = filters.topics;
            }
        }

        if (filters.facet_exclude) {
            newState.facet_exclude = filters.facet_exclude;
        }

        return newState;
    }
    handleRedirect(params, source){

        if (source === 'facets') {
            this.handleSearch(params);
        } else {
            let filters = this.getAdvancedFilters();
            let curKeywords = (this.state.keywords === '*:*') ? '' : this.state.keywords;
            let prevKeywords = (this.props.SearchResultsStore.request.qs.keywords === '*:*')
                ? '' : this.props.SearchResultsStore.request.qs.keywords;

            // keywords are the same as the previous search
            if (curKeywords === prevKeywords) {
                let newState = this.applyAdvancedFilters(filters);
                this.setState(newState, () => {
                    this.handleSearch(params);
                });

            // new keywords
            } else {
                this.setState({
                    ...this.state,
                    language: filters.language || [],
                    tag: filters.tag || [],
                    user: filters.user || [],
                    educationLevel: filters.educationLevel || [],
                    topics: filters.topics || [],
                    facet_exclude: filters.facet_exclude || [],
                }, () => {
                    this.handleSearch(params);
                });
            }
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
        this.setState({ activeIndex: null }); // Close the advanced options <Accordion>
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

        if (fieldName === 'educationLevel' || fieldName === 'all') {
            newState.educationLevel = [];
        }

        if (fieldName === 'topics' || fieldName === 'all') {
            newState.topics = [];
        }

        newState.facet_exclude = this.getSelectedFacetFields();

        this.setState(newState, () => {
            this.handleRedirect(null, 'facets');
        });
    }
    handleDropdownChange = (e, dropdown) => {
        this.setState({
            [dropdown.id]: dropdown.value,
        });
    };
    render() {
        let options = <div><div className="three fields">
            <div className="sr-only" id="describe_level">Select education level of deck content</div>
            <div className="sr-only" id="describe_topic">Select subject of deck content from autocomplete</div>

            <div className="field">
                <label htmlFor="language" id="language_label"><FormattedMessage {...this.messages.languageFilterTitle} /></label>
                <select id='languageDropdown' name='language' aria-labelledby="language_label" multiple='' className='ui fluid search dropdown' ref='language'>
                  <option value=' '>{this.context.intl.formatMessage(this.messages.languageFilterPlaceholder)}</option>
                  {translationLanguages.reduce((arr, curr) => { //<div className="menu">
                      arr.push(<option value={curr} key={curr}>{getLanguageNativeName(curr)}</option>);
                      return arr;
                  }, [])}
                </select>
            </div>
            <TagInput
                id='topics'
                onlyExistingTags={true}
                tagFilter={{ tagType: 'topic' }}
                value={Array.isArray(this.state.topics) ? this.state.topics : []}
                onChange={this.handleDropdownChange}
                placeholder={this.context.intl.formatMessage(this.messages.selectSubject)}
                label={this.context.intl.formatMessage(this.messages.subject)}
            />
            <div className="field">
                <label htmlFor="level_input" id="level_label"><FormattedMessage id="DeckFilter.Education" defaultMessage="Education Level" /></label>
                <Dropdown id="level_input" ref={ (e) => { this.educationLevelsDropdown = e; }} fluid selection aria-labelledby="level_label" aria-describedby="describe_level"
                    options={ [{ value: null, text: '' }, ...Object.entries(educationLevels).map(([value, text]) => ({value, text}) )] }
                    placeholder="Select Education Level" />
            </div>
        </div>
        <div className="two fields">
            <div className="field">
                <label htmlFor="users_input_field" id="user_label"><FormattedMessage {...this.messages.usersFilterTitle} /></label>
                <UsersInput ref={ (e) => { this.userDropdown = e; }} ariaLabelledby="user_label" placeholder={this.context.intl.formatMessage(this.messages.usersFilterPlaceholder)} />
            </div>

            <div className="field">
                <label htmlFor="tags_input_field" id="tags_label"><FormattedMessage {...this.messages.tagsFilterTitle} /></label>
                <TagInput 
                    id='tag'
                    onlyExistingTags={true}
                    ariaLabelledby="tags_label" 
                    placeholder={this.context.intl.formatMessage(this.messages.tagsFilterPlaceholder)} 
                    onChange={this.handleDropdownChange}
                    value={Array.isArray(this.state.tag) ? this.state.tag : []}
                />
            </div>
        </div></div>;

        const messages = defineMessages({
            advancedOptions:{
                id: 'search.advanceoptions',
                defaultMessage: 'Advanced Options'
            }
        });

        return (
            <div className="ui container">
                <h1 className="ui header" style={{marginTop: '1em'}}><FormattedMessage {...this.messages.header} /></h1>
                <form className="ui form success">
                    <div className="field" role="search">
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <KeywordsInputWithFilter ref={ (el) => { this.keywordsInput = el; }} value={this.state.keywords || ''} onSelect={this.onSelect.bind(this)} onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} placeholder={this.context.intl.formatMessage(this.messages.keywordsInputPlaceholder)} handleRedirect={this.handleRedirect.bind(this)} buttonText={this.context.intl.formatMessage(this.messages.submitButton)} fieldValue={this.state.field || ' '}/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <SingleItemAccordion
                                        buttonContent={this.context.intl.formatMessage(messages.advancedOptions)}
                                        buttonAs='button'
                                        revealContent={ options }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
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
                            request={this.props.SearchResultsStore.request}
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
                                educationLevel: this.state.educationLevel || [],
                                topics: this.state.topics || [],
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
