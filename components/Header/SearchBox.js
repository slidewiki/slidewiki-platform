import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import SearchResultsStore from '../../stores/SearchResultsStore';
let ReactDOM = require('react-dom');

class SearchBox extends React.Component {

    handleRedirect(searchstring){

        let searchstr = 'q=';
        if(this.refs.searchstring.value.trim() === ''){
            // searchstr += encodeURIComponent('*:*');
            return;
        }
        else{
            searchstr += encodeURIComponent(this.refs.searchstring.value);
        }
        searchstr += '&revisions=false';

        this.context.executeAction(navigateAction, {
            url: '/search/' + searchstr
        });

        this.refs.searchstring.value = '';
        return false;
    }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handleRedirect();
        }
    }
    render() {
        return (
            <div className="ui small icon input" ref="searchBox">
                <label htmlFor="searchString" hidden>Search</label>
                <input type="text" placeholder="Search..." id="searchString" ref="searchstring" onKeyPress={this.handleKeyPress.bind(this)} />
                <i className="search link icon" onClick={this.handleRedirect.bind(this)} onChange={this.handleRedirect.bind(this)}></i>
            </div>
        );
    }
}
SearchBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SearchBox;
