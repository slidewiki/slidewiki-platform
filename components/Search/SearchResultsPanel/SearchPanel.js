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
        if(this.props.SearchResultsStore.searchstatus === 'advsearch' || this.props.SearchResultsStore.searchstatus === 'advsearchresults'){
            advSearchDiv = <AdvancedSearch />;
        }

        let searchResultsDiv='';
        if(this.props.SearchResultsStore.searchstatus === 'results' || this.props.SearchResultsStore.searchstatus === 'advsearchresults'){
            searchResultsDiv = <SearchResultsPanel />;
        }


        return (
            <div ref="searchPanel">

                <div className='advancedSearch' style={{margin: '1em'}}>
                    {advSearchDiv}
                </div>
                <div className='searchResults' style={{margin: '1em'}}>
                    {searchResultsDiv}
                </div>

            </div>
        );
    }
}

SearchPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getState: React.PropTypes.func.isRequired,
};
SearchPanel = connectToStores(SearchPanel, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default SearchPanel;
