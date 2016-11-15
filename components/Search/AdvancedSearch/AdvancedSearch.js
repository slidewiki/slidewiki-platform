import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
// import AdvancedSearchStore from '../../../stores/AdvancedSearchStore';
import SearchResultsPanel from '../SearchResultsPanel/SearchResultsPanel';
import SearchParamsStore from '../../../stores/SearchParamsStore';
import loadSearchResults from '../../../actions/search/loadSearchResults';
import UsersInput from '../AutocompleteComponents/UsersInput';
import KeywordsInput from '../AutocompleteComponents/KeywordsInput';

class AdvancedSearch extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchstring: this.props.paramsStore.searchstring,
            entity: this.props.paramsStore.entity,
            lang: this.props.paramsStore.lang,
            fields: this.props.paramsStore.fields,
            users: this.props.paramsStore.users,
            tags: this.props.paramsStore.tags,
            revisions: this.props.paramsStore.revisions,
            license: this.props.paramsStore.license
        };
    }
    componentWillReceiveProps(nextProps){
        // TODO: check a more elegant way to do this!
        if(!this.props.paramsStore.fetch) return;
        this.setState(this.props.paramsStore);
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
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (nextProps.searchstring != this.state.searchstring);
    // }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handleRedirect();
        }
    }
    getEncodedParams(){
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

        return this.encodeParams(queryparams);
    }
    encodeParams(queryparams){
        let encodedParams = '';
        for (let key in queryparams) {
            if(encodedParams){
                encodedParams += '&';
            }
            encodedParams += encodeURIComponent(key) + '=' + encodeURIComponent(queryparams[key]);
        }

        return encodedParams;
    }
    handleRedirect(){
        if(this.refs.keywords.getSelected().trim() === ''){
            return;
        }
        this.context.executeAction(navigateAction, {
            url:  '/search/' + this.getEncodedParams()
        });

        return false;
    }
    render() {
        // facet lists initialization
        const languageList = this.props.paramsStore.languages.map((item, index) => {
            return (
                <option key={item.id} value={item.value}>{item.description}</option>
            );
        });

        const entityList = this.props.paramsStore.entities.map((item, index) => {
            return (
                <option key={item.id} value={item.value}>{item.description}</option>
            );
        });
        let searchstring = decodeURIComponent(this.state.searchstring);
        let defaultSearchstring = (searchstring === '*:*') ? '' : searchstring;
        let clearInputIcon = '';

        return (
                <div className="ui content">
                    <h2 className="ui header" style={{marginTop: '1em'}}>Search</h2>
                    <form className="ui form success">
                        <div className="field">
                            <label htmlFor="SearchTerm">Search Term</label>
                            <KeywordsInput ref='keywords' onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} value={defaultSearchstring} placeholder='Type your keywords here' clearInputHandler={this.clearInput.bind(this)}/>
                        </div>
                        <div className="four fields">
                            <div className="field">
                                <label htmlFor="fields">Search field</label>
                                <select name='fields' id='fields' onChange={this.onChange.bind(this)} value={this.state.fields} multiple='' className='ui fluid search dropdown' ref='fields'>
                                  <option value=''>Select Search field</option>
                                  <option value='title'>Title</option>
                                  <option value='content'>Content</option>
                                  <option value='speakernotes'>Speakernotes</option>
                                  <option value='description'>Description</option>
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="entity">Entity</label>
                                <select name='entity' id='entity' onChange={this.onChange.bind(this)} value={this.state.entity} multiple='' className='ui fluid search dropdown' ref='entity'>
                                  <option value=''>Select Entity</option>
                                  {entityList}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="language">Language</label>
                                <select name='language' onChange={this.onChange.bind(this)} value={this.state.language} multiple='' id='language' className='ui fluid search dropdown' ref='language'>
                                  <option value=''>Select Language</option>
                                  {languageList}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="license">License</label>
                                <select name='license' id='license' onChange={this.onChange.bind(this)} value={this.state.license} multiple='' className='ui fluid search dropdown' ref='license'>
                                  <option value=''>Select Search field</option>
                                  <option value='CC0'>CC0</option>
                                  <option value='CC BY'>CC BY</option>
                                  <option value='CC BY-SA'>CC BY-SA</option>
                                </select>
                            </div>

                        </div>

                        <div className="two fields">
                            <div className="field">
                                <label htmlFor="search_id">User</label>
                                <UsersInput ref='users' placeholder='Select Users' />
                            </div>

                            <div className="field">
                                <label htmlFor="tags">Tags</label>
                                <input name='tags' id='tags' onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} value={this.state.tags} placeholder="Tags" type="text" ref='tags'></input>
                            </div>

                        </div>

                        <div className="field">                           
                            <div className="ui checkbox revisions" style={{marginTop: '1em', marginBottom: '1em'}}>
                                <input name='revisions' id='revisions' onChange={this.onChange.bind(this)} tabIndex="0" type="checkbox" ref='revisions'></input>
                            <label htmlFor="revisions">Include revisions</label>
                            </div>
                        </div>

                        <div role="button"  className="ui primary submit button" tabIndex="0" onClick={this.handleRedirect.bind(this)}>
                             Submit
                        </div>

                    </form>

                </div>

        );

    }
}

AdvancedSearch.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

AdvancedSearch = connectToStores(AdvancedSearch, [SearchParamsStore], (context, props) => {
    return {
        paramsStore: context.getStore(SearchParamsStore).getState()
    };
});

export default AdvancedSearch;
