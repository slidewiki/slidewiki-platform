import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../stores/SearchResultsStore';
import SearchParamsStore from '../../stores/SearchParamsStore';
import ErrorStore from '../../stores/ErrorStore';
// import AdvancedSearch from './AdvancedSearch/AdvancedSearch';
import SearchResultsPanel from './SearchResultsPanel/SearchResultsPanel';
import loadSearchResults from '../../actions/search/loadSearchResults';
import UsersInput from './AutocompleteComponents/UsersInput';
import TagsInput from './AutocompleteComponents/TagsInput';
import KeywordsInput from './AutocompleteComponents/KeywordsInput';

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
            revisions: this.props.SearchParamsStore.revisions,
            license: this.props.SearchParamsStore.license
        };
    }
    initDropdown(){
        $('#field').dropdown();
        $('#kind').dropdown();
        $('#language').dropdown();
        $('#license').dropdown();
    }
    componentDidMount(){
        this.initDropdown();
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
        // console.log(event.target.name + ' -> ' + event.target.value);
        let curstate = {};
        curstate[event.target.name] = event.target.value;
        this.setState(curstate);
    }
    clearInput(){
        this.setState({searchstring: ''});
        this.refs.keywords.focus();
    }
    onSelect(searchstring){
        this.setState({keywords: searchstring});
        this.handleRedirect();
    }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handleRedirect();
        }
    }
    getEncodedParams(params){
        let queryparams = {
            keywords: (params && params.keywords)
                        ? params.keywords       // if keywords are set from redirection
                        : (this.refs.keywords.getSelected().trim() || '*:*'),   //else get keywords from input, and if empty set wildcard to fetch all
            field: this.refs.field.value.trim(),
            kind: this.refs.kind.value.trim(),
            language: this.refs.language.value.trim(),
            license: this.refs.license.value.trim(),
            user: this.refs.user.getSelected().split(','),
            tag: this.refs.tag.getSelected().split(','),
            // revisions: $('.ui.checkbox.revisions').checkbox('is checked')
            sort: (params && params.sort) ? params.sort : ''
        };

        // encode params
        let encodedParams = '';
        for(let key in queryparams){
            if(queryparams[key] instanceof Array){
                for(let el in queryparams[key]){
                    encodedParams += this.encodeParam(encodedParams, key, queryparams[key][el]);
                }
            }
            else{
                encodedParams += this.encodeParam(encodedParams, key, queryparams[key]);
            }
        }

        return encodedParams;
    }
    encodeParam(encodedParams, key, value){
        if(value.trim() === '')
            return '';

        return ((encodedParams) ? '&' : '')
                + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    handleRedirect(params){
        this.context.executeAction(navigateAction, {
            url:  '/search/' + this.getEncodedParams(params)
        });

        this.refs.keywords.blur();

        return false;
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
                queryparams={this.props.SearchParamsStore.queryparams}
                loadMore={this.props.SearchResultsStore.loadMore}
                loadMoreLoading={this.props.SearchResultsStore.loadMoreLoading}
                start={this.props.SearchResultsStore.start}
            />;
        }
        return (
            <div className="ui container" ref="searchPanel">
                <div className='advancedSearch'>
                    <div className="ui content">
                        <h2 className="ui header" style={{marginTop: '1em'}}>Search</h2>
                        <form className="ui form success">
                            <div className="field">
                                <label htmlFor="SearchTerm">Search Term</label>
                                <KeywordsInput ref='keywords' onSelect={this.onSelect.bind(this)} onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} value={decodeURIComponent(this.state.keywords)} placeholder='Type your keywords here' clearInputHandler={this.clearInput.bind(this)}/>
                            </div>
                            <div className="four fields">
                                <div className="field">
                                    <label htmlFor="field">Search field</label>
                                    <select name='field' id='field' onChange={this.onChange.bind(this)} value={this.state.field} multiple='' className='ui fluid search dropdown' ref='field'>
                                      <option value=' '>Select Search field</option>
                                      <option value='title'>Title</option>
                                      <option value='description'>Description</option>
                                      <option value='content'>Content</option>
                                      <option value='speakernotes'>Speakernotes</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label htmlFor="kind">Entity</label>
                                    <select name='kind' id='kind' onChange={this.onChange.bind(this)} value={this.state.kind} multiple='' className='ui fluid search dropdown' ref='kind'>
                                      <option value=' '>Select Entity</option>
                                      <option value='slide'>Slide</option>
                                      <option value='deck'>Deck</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label htmlFor="language">Language</label>
                                    <select name='language' onChange={this.onChange.bind(this)} value={this.state.language} multiple='' id='language' className='ui fluid search dropdown' ref='language'>
                                      <option value=' '>Select Language</option>
                                      <option value='en_GB'>English</option>
                                      <option value='de_DE'>German</option>
                                      <option value='el_GR'>Greek</option>
                                      <option value='it_IT'>Italian</option>
                                      <option value='pt_PT'>Portuguese</option>
                                      <option value='sr_RS'>Serbian</option>
                                      <option value='es_ES'>Spanish</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label htmlFor="license">License</label>
                                    <select name='license' id='license' onChange={this.onChange.bind(this)} value={this.state.license} multiple='' className='ui fluid search dropdown' ref='license'>
                                      <option value=' '>Select License</option>
                                      <option value='CC0'>CC0</option>
                                      <option value='CC BY'>CC BY</option>
                                      <option value='CC BY-SA'>CC BY-SA</option>
                                    </select>
                                </div>

                            </div>

                            <div className="two fields">
                                <div className="field">
                                    <label htmlFor="users_input_field">User</label>
                                    <UsersInput ref='user' placeholder='Select Users' />
                                </div>

                                <div className="field">
                                    <label htmlFor="tags_input_field">Tags</label>
                                    <TagsInput ref='tag' placeholder='Select Tags' />
                                </div>

                            </div>
    {
                            // <div className="field">
                            //     <div className="ui checkbox revisions" style={{marginTop: '1em', marginBottom: '1em'}}>
                            //         <input name='revisions' id='revisions' onChange={this.onChange.bind(this)} tabIndex="0" type="checkbox" ref='revisions'></input>
                            //     <label htmlFor="revisions">Include revisions</label>
                            //     </div>
                            // </div>
    }
                            <div role="button"  className="ui primary submit button" tabIndex="0" onClick={this.handleRedirect.bind(this)}>
                                 Submit
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
    executeAction: React.PropTypes.func.isRequired,
};

SearchPanel = connectToStores(SearchPanel, [SearchResultsStore, SearchParamsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState(),
        SearchParamsStore: context.getStore(SearchParamsStore).getState()
    };
});

export default SearchPanel;
