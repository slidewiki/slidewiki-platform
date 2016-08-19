import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AdvancedSearchStore from '../../../stores/AdvancedSearchStore';
// import loadAdvancedSearchResults from '../../../actions/search/loadAdvancedSearchResults';
import SearchResultsPanel from '../SearchResultsPanel/SearchResultsPanel';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import loadSearchResults from '../../../actions/search/loadSearchResults';

class AdvancedSearch extends React.Component {
    // constructor(...args) {
    //     super(...args);
    //
    //     this.state = {
    //         openExtraFields: this.props.openExtraFields
    //     };
    //     console.log("- constructor " + this.props.openExtraFields);
    // }
    // componentWillReceiveProps(nextProps){
    //     if(nextProps.openExtraFields !== 'undefined')
    //         this.setCollapseState(nextProps.openExtraFields);
    // }
    handleRedirect(searchstring, deckid, userid){

        let searchparams='';
        if(this.refs.advsearchstring.value !== '' /*undefined*/){
            searchparams='q='+this.refs.advsearchstring.value;
        }
        else{
            searchparams='q=*:*';
        }
        if(this.refs.entity !== undefined && this.refs.entity.value !== ''){
            searchparams=searchparams+'+entity='+this.refs.entity.value;
        }

        if(this.refs.searchlang !== undefined && this.refs.searchlang.value !== ''){
            searchparams=searchparams+'+lang='+this.refs.searchlang.value;
        }

        // console.log('SEARCH STRING 2: '+searchparams);

        //user groups

        //search fields

        //user

        //tags

        //include revisions


        this.context.executeAction(navigateAction, {
            url:  '/search/' + encodeURIComponent(searchparams)
            // url:  '/search/advsearchresults/searchstring=' + this.refs.searchstring.value +
            //       '/' + this.refs.entity.value + //entity
            //       '/' + this.refs.searchlang.value //language
            //       // '/deckid=' + this.refs.deckid.value +
            //       // '/userid=' + this.refs.userid.value
        });


        return false;
    }
    // toggleCollapseState(){
    //     this.setState({ openExtraFields: !this.state.openExtraFields });
    //     // this.context.executeAction(collapseExtraSearchFields, {
    //         // collapseState: this.state.collapseState
    //     // });
    //     // console.log("- change state : " + this.state.open);
    // }
    // setCollapseState(val){
    //     this.setState({ openExtraFields: val });
    // }
    // setCollapseState(collapseValue){
    //     alert(collapseValue);
    // }
    render() {
        console.log("hereeeeeeeeeeeeee " + this.props.SearchResultsStore.entity);
        // console.log("adv search panel - pre render");

        // let extraSearchFields = <div ref="extraSearchFields">
            ;
// console.log("edw extra  " + this.state.openExtraFields);
        // let extraSearchFieldsPanel = (this.state.openExtraFields) ? extraSearchFields : null;
// console.log("edw extra  " + this.state.openExtraFields);
        // console.log("panel " + this.props.AdvancedSearchStore.collapseState);
        // console.log("panel status " + this.props.SearchResultsStore.searchstatus);
        // let collapseState = (this.props.SearchResultsStore.searchstatus === 'results') ? true : false;
        // this.setCollapseState(collapseState);

        return (

                <div className="ui content">
                    <h2 className="ui header" style={{marginTop: '1em'}}>Search</h2>

                    <form className="ui form success">
                        <div className="field full">
                            <input name='advsearchstring' /*defaultValue='mpla' */ placeholder='Text search' type='text' ref='advsearchstring'></input>
                        </div>

                        <div className="four fields">
                            <div className="field">
                                <label>Entity</label>
                                <select name='entity' multiple='' className='ui fluid search dropdown' ref='entity'>
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
                                <select name='lang' multiple='' className='ui fluid search dropdown' ref='searchlang'>
                                  <option value=''>Select Language</option>
                                  <option value='en'>English</option>
                                  <option value='es'>Spanish</option>
                                  <option value='gr'>Greek</option>
                                </select>
                            </div>

                            <div className="field">
                                <label>User groups</label>
                                <select name='usergroup' multiple='' className='ui fluid search dropdown' ref='usergroup'>
                                  <option value=''>Select User group</option>
                                  <option value='UNI'>Universities</option>
                                  <option value='RC'>Research Centers</option>
                                  <option value='OTHER'>Other</option>
                                </select>
                            </div>

                            <div className="field">
                                <label>Search fields</label>
                                <select name='searchfields' multiple='' className='ui fluid search dropdown' ref='searchfields'>
                                  <option value=''>Select Search field</option>
                                  <option value='ALL'>All</option>
                                  <option value='TITL'>Title</option>
                                  <option value='CONT'>Content</option>
                                </select>
                            </div>
                        </div>

                        <div className="two fields">
                            <div className="field">
                                <label>User</label>
                                <input name="user" placeholder="User" type="text"></input>
                            </div>

                            <div className="field">
                                <label>Tags</label>
                                <input name="tags" placeholder="Tags" type="text"></input>
                            </div>

                        </div>

                        <div className="field">
                            <div className="ui checkbox" style={{marginTop: '1em', marginBottom: '1em'}}>
                                <input name="revisions" type="checkbox"></input>
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
// AdvancedSearch = connectToStores(AdvancedSearch, [AdvancedSearchStore], (context, props) => {
//     return {
//         AdvancedSearchStore: context.getStore(AdvancedSearchStore).getState()
//     };
// });
AdvancedSearch = connectToStores(AdvancedSearch, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});


export default AdvancedSearch;
