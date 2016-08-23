import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import ErrorStore from '../../../stores/ErrorStore';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';
import SearchResultsPanel from './SearchResultsPanel';

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
            advSearchDiv = <AdvancedSearch
                                searchstring={this.props.SearchResultsStore.searchstring}
                                entity={this.props.SearchResultsStore.entity}
            />;
        // }
        // else{
        //     advSearchDiv = <AdvancedSearch title={searchPanelTitle} openExtraFields={openExtraFields}/>;
        // }
        let loadingDiv = <div className="ui basic segment">
            <div className="ui active text loader">Loading</div>
        </div>;

        let searchResultsDiv='';

        if(this.props.SearchResultsStore.queryparams){
            searchResultsDiv = <SearchResultsPanel />;
        }
        if(this.props.SearchResultsStore.loading){
            searchResultsDiv = loadingDiv;
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
    executeAction: React.PropTypes.func.isRequired,
    // getState: React.PropTypes.func.isRequired,
};
SearchPanel = connectToStores(SearchPanel, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default SearchPanel;
