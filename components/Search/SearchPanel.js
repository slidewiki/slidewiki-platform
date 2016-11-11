import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../stores/SearchResultsStore';
import SearchParamsStore from '../../stores/SearchParamsStore';
import ErrorStore from '../../stores/ErrorStore';
import AdvancedSearch from './AdvancedSearch/AdvancedSearch';
import SearchResultsPanel from './SearchResultsPanel/SearchResultsPanel';

class SearchPanel extends React.Component {
    render() {
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
                entities={this.props.SearchParamsStore.entities}
                languages={this.props.SearchParamsStore.languages}
            />;
        }
// console.log("render");
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
    executeAction: React.PropTypes.func.isRequired,
    // getState: React.PropTypes.func.isRequired,
};
SearchPanel = connectToStores(SearchPanel, [SearchResultsStore, SearchParamsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState(),
        SearchParamsStore: context.getStore(SearchParamsStore).getState()
    };
});

export default SearchPanel;
