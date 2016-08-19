import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import SearchResultsStore from '../../stores/SearchResultsStore';
let ReactDOM = require('react-dom');

class SearchBox extends React.Component {

    handleRedirect(searchstring){

        let searchstr = 'q=';
        if(this.refs.searchstring.value === ''){
            searchstr = searchstr + '*:*';
        }
        else{
            searchstr = searchstr + this.refs.searchstring.value;
        }

        this.context.executeAction(navigateAction, {
            // url: '/search/results/q=' + encodeURIComponent(this.refs.searchstring.value)
            url: '/search/' + encodeURIComponent(searchstr)
        });
        this.refs.searchstring.value='';
        return false;
    }
    render() {
        return (
            <div className="ui small icon input" ref="searchBox">
                <input type="text" placeholder="Search..." ref="searchstring" />
                <i className="search link icon" onClick={this.handleRedirect.bind(this)} onEnter={this.handleRedirect.bind(this)} onChange={this.handleRedirect.bind(this)}></i>
            </div>
        );
    }
}
SearchBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
SearchBox = connectToStores(SearchBox, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default SearchBox;
