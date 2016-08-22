import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AdvancedSearchStore from '../../../stores/AdvancedSearchStore';
import SearchResultsPanel from '../SearchResultsPanel/SearchResultsPanel';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import loadSearchResults from '../../../actions/search/loadSearchResults';

class AdvancedSearch extends React.Component {
    handleRedirect(){

        // form query parameters
        let queryparams='';

        if(this.refs.searchstring && this.refs.searchstring.value){
            queryparams = 'q=' + encodeURIComponent(this.refs.searchstring.value);
        }
        else{
            queryparams = 'q=' + encodeURIComponent('*:*');
        }

        if(this.refs.entity && this.refs.entity.value){
            queryparams += '&entity=' + this.refs.entity.value;
        }

        if(this.refs.lang && this.refs.lang.value){
            queryparams += '&lang=' + this.refs.lang.value;
        }

        if(this.refs.group && this.refs.group.value){
            queryparams += '&group=' + this.refs.group.value;
        }

        if(this.refs.fields && this.refs.fields.value){
            queryparams += '&fields=' + this.refs.fields.value;
        }

        if(this.refs.user && this.refs.user.value){
            queryparams += '&user=' + encodeURIComponent(this.refs.user.value);
        }

        if(this.refs.tags && this.refs.tags.value){
            queryparams += '&tags=' + encodeURIComponent(this.refs.tags.value);
        }

        // if(this.refs.revisions && this.refs.revisions.value){
        //     queryparams += '&revisions=' + this.refs.revisions.value;
        // }

        this.context.executeAction(navigateAction, {
            url:  '/search/' + queryparams
        });


        return false;
    }
    render() {
        // console.log("rendeeeeeeeeeeeeeer " + this.props.SearchResultsStore.searchstring);
        let searchstring = '';
        if(this.props.SearchResultsStore.searchstring){
            searchstring = this.props.SearchResultsStore.searchstring;
        }

        let curEntity = '';
        if(this.props.SearchResultsStore.entity){
            curEntity = this.props.SearchResultsStore.entity;
        }
        // console.log("edw cur " + curEntity);

        return (

                <div className="ui content">
                    <h2 className="ui header" style={{marginTop: '1em'}}>Search</h2>
                    <form className="ui form success">
                        <div className="field">
                            <input name='searchstring' defaultValue={searchstring} placeholder='Text search' type='text' ref='searchstring'></input>
                        </div>

                        <div className="four fields">
                            <div className="field">
                                <label>Entity</label>
                                <select name='entity' /*defaultValue={curEntity}*/ multiple='' className='ui fluid search dropdown' ref='entity'>
                                  <option value=''>Select Entity</option>
                                  <option value='slide'>Slide</option>
                                  <option value='deck'>Deck</option>
                                  <option value='answer'>Answer</option>
                                  <option value='question'>Question</option>
                                  <option value='comment'>Comment</option>
                                </select>
                            </div>

                            <div className="field">
                                <label>Language</label>
                                <select name='lang' multiple='' className='ui fluid search dropdown' ref='lang'>
                                  <option value=''>Select Language</option>
                                  <option value='en'>English</option>
                                  <option value='es'>Spanish</option>
                                  <option value='gr'>Greek</option>
                                </select>
                            </div>

                            <div className="field">
                                <label>User groups</label>
                                <select name='group' multiple='' className='ui fluid search dropdown' ref='group'>
                                  <option value=''>Select User group</option>
                                  <option value='uni'>Universities</option>
                                  <option value='rc'>Research Centers</option>
                                  <option value='other'>Other</option>
                                </select>
                            </div>

                            <div className="field">
                                <label>Search fields</label>
                                <select name='fields' multiple='' className='ui fluid search dropdown' ref='fields'>
                                  <option value=''>Select Search field</option>
                                  <option value='all'>All</option>
                                  <option value='title'>Title</option>
                                  <option value='content'>Content</option>
                                </select>
                            </div>
                        </div>

                        <div className="two fields">
                            <div className="field">
                                <label>User</label>
                                <input name='user' placeholder="User" type="text" ref='user'></input>
                            </div>

                            <div className="field">
                                <label>Tags</label>
                                <input name='tags' placeholder="Tags" type="text" ref='tags'></input>
                            </div>

                        </div>

                        <div className="field">
                            <div className="ui checkbox" style={{marginTop: '1em', marginBottom: '1em'}}>
                                <input name='revisions' type="checkbox" ref='revisions'></input>
                                <label>Include revisions</label>
                            </div>
                        </div>


                        <div className="ui primary submit button" onClick={this.handleRedirect.bind(this)}>
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

AdvancedSearch = connectToStores(AdvancedSearch, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default AdvancedSearch;
