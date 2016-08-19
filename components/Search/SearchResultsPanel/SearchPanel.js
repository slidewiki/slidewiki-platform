import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';
import SearchResultsPanel from './SearchResultsPanel';

class SearchPanel extends React.Component {

    render() {
        console.log("search panel - pre render");

        let advSearchDiv='';

        // let openExtraFields = false;
        // let searchPanelTitle = 'Search';
        // // if(this.props.SearchResultsStore.searchstring != undefined && this.props.SearchResultsStore.searchstring !== ''){
        // //     openExtraFields = false;
        // // }
        // if(this.props.SearchResultsStore.searchstatus === 'advsearch' || this.props.SearchResultsStore.searchstatus === 'advsearchresults'){
        //     openExtraFields = true;
        //     searchPanelTitle = 'Advanced Search';
        // }
        // console.log("open : " + this.props.SearchResultsStore.searchstatus + " - " + openExtraFields);
        // if(this.props.SearchResultsStore.searchstatus === 'results'){
            advSearchDiv = <AdvancedSearch />;
        // }
        // else{
        //     advSearchDiv = <AdvancedSearch title={searchPanelTitle} openExtraFields={openExtraFields}/>;
        // }


        let searchResultsDiv='';
        // console.log("panel " + this.props.SearchResultsStore.searchstatus);
        console.log("string : " + this.props.SearchResultsStore.searchstring);
        if(this.props.SearchResultsStore.searchstring /* || this.props.SearchResultsStore.searchstatus === 'advsearchresults' */){
            searchResultsDiv = <SearchResultsPanel />;
        }
        else{
            searchResultsDiv = null;
        }


        return (
            <div className="ui container" ref="searchPanel">
                <div className='advancedSearch'>
                    {advSearchDiv}
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
    executeAction: React.PropTypes.func.isRequired
};
SearchPanel = connectToStores(SearchPanel, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default SearchPanel;
