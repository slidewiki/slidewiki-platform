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
import KeywordsInput from './AutocompleteComponents/KeywordsInput';

class SearchPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchstring: this.props.SearchParamsStore.searchstring,
            entity: this.props.SearchParamsStore.entity,
            language: this.props.SearchParamsStore.language,
            fields: this.props.SearchParamsStore.fields,
            users: this.props.SearchParamsStore.users,
            tags: this.props.SearchParamsStore.tags,
            revisions: this.props.SearchParamsStore.revisions,
            license: this.props.SearchParamsStore.license
        };
    }
    initDropdown(){
        $('#fields').dropdown();
        $('#entity').dropdown();
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
        let curstate = {};
        curstate[event.target.name] = event.target.value;
        this.setState(curstate);
    }
    clearInput(){
        this.setState({searchstring: ''});
        this.refs.keywords.focus();
    }
    onSelect(searchstring){
        this.setState({searchstring: searchstring});
        this.handleRedirect();
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (nextProps.searchstring != this.state.searchstring);
    // }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handleRedirect();
        }
    }
    getEncodedParams(params){
        let queryparams = {};

        // determine given params
        if(this.refs.keywords && this.refs.keywords.getSelected().trim()){
            queryparams.q = this.refs.keywords.getSelected().trim();
        }
        else{
            queryparams.q = encodeURIComponent('*:*');
        }

        if(this.refs.entity && this.refs.entity.value){
            queryparams.entity = this.refs.entity.value;
        }

        if(this.refs.language && this.refs.language.value){
            queryparams.language = this.refs.language.value;
        }

        // if(this.refs.group && this.refs.group.value){
        //     queryparams.group = this.refs.group.value;
        // }

        if(this.refs.fields && this.refs.fields.value){
            queryparams.fields = this.refs.fields.value;
        }

        if(this.refs.users && this.refs.users.getSelected()){
            queryparams.users = this.refs.users.getSelected();
        }

        if(this.refs.tags && this.refs.tags.value){
            queryparams.tags = this.refs.tags.value.trim();
        }

        if(this.refs.license && this.refs.license.value){
            queryparams.license = this.refs.license.value.trim();
        }

        if(this.refs.revisions && this.refs.revisions.value){
            queryparams.revisions = $('.ui.checkbox.revisions').checkbox('is checked');
        }

        // encode extra parameters paased as arguments e.g. sort param
        if(params && params.sort){
            queryparams.sort = params.sort;
        }

        return this.encodeParams(queryparams);
    }
    encodeParams(queryparams){
        let encodedParams = '';
        for (let key in queryparams) {
            if(queryparams[key].trim() === ''){
                continue;
            }
            if(encodedParams){
                encodedParams += '&';
            }
            encodedParams += encodeURIComponent(key) + '=' + encodeURIComponent(queryparams[key]);
        }

        return encodedParams;
    }
    handleRedirect(params){
        if(this.refs.keywords.getSelected().trim() === ''){
            return;
        }
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
                numFound={this.props.SearchResultsStore.numFound}
                sort={this.props.SearchParamsStore.sort}
                handleRedirect={this.handleRedirect.bind(this)}
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
                                <KeywordsInput ref='keywords' onSelect={this.onSelect.bind(this)} onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} value={decodeURIComponent(this.state.searchstring)} placeholder='Type your keywords here' clearInputHandler={this.clearInput.bind(this)}/>
                            </div>
                            <div className="four fields">
                                <div className="field">
                                    <label htmlFor="fields">Search field</label>
                                    <select name='fields' id='fields' onChange={this.onChange.bind(this)} value={this.state.fields} multiple='' className='ui fluid search dropdown' ref='fields'>
                                      <option value=' '>Select Search field</option>
                                      <option value='title'>Title</option>
                                      <option value='description'>Description</option>
                                      <option value='content'>Content</option>
                                      <option value='speakernotes'>Speakernotes</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label htmlFor="entity">Entity</label>
                                    <select name='entity' id='entity' onChange={this.onChange.bind(this)} value={this.state.entity} multiple='' className='ui fluid search dropdown' ref='entity'>
                                      <option value=' '>Select Entity</option>
                                      <option value='slide'>Slide</option>
                                      <option value='deck'>Deck</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label htmlFor="language">Language</label>
                                    <select name='language' onChange={this.onChange.bind(this)} value={this.state.language} multiple='' id='language' className='ui fluid search dropdown' ref='language'>
                                      <option value=' '>Select Language</option>
                                      <option value='en'>English</option>
                                      <option value='de'>German</option>
                                      <option value='el'>Greek</option>
                                      <option value='it'>Italian</option>
                                      <option value='pt'>Portugese</option>
                                      <option value='sr'>Serbian</option>
                                      <option value='es'>Spanish</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label htmlFor="license">License</label>
                                    <select name='license' id='license' onChange={this.onChange.bind(this)} value={this.state.license} multiple='' className='ui fluid search dropdown' ref='license'>
                                      <option value=' '>Select Search field</option>
                                      <option value='CC0'>CC0</option>
                                      <option value='CC BY'>CC BY</option>
                                      <option value='CC BY-SA'>CC BY-SA</option>
                                    </select>
                                </div>

                            </div>

                            <div className="two fields">
                                <div className="field">
                                    <label htmlFor="users_input_field">User</label>
                                    <UsersInput ref='users' placeholder='Select Users' />
                                </div>

                                <div className="field disabled">
                                    <label htmlFor="tags">Tags</label>
                                    <input name='tags' id='tags' onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} value={this.state.tags} placeholder="Tags" type="text" ref='tags' tabIndex="-1"></input>
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
