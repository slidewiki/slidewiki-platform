import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';
import loadSearchResults from '../../../actions/search/loadSearchResults';
import SpellcheckPanel from './SpellcheckPanel';
import loadMoreResults from '../../../actions/search/loadMoreResults';

class SearchResultsPanel extends React.Component {

    initSortDropdown(){
        let changeSort = this.props.changeSort.bind(this);
        $('#sortDropdown').dropdown({
            onChange: function(value, text, $choice){
                changeSort(value);
            }
        });
    }
    componentDidMount(){
        this.initSortDropdown();
    }
    componentDidUpdate(){
        this.initSortDropdown();
    }
    renderSortDropdownItems(){
        if(this.props.sort === 'lastUpdate'){
            return <div className="menu">
                <div className="item" data-value="score">Relevance</div>
                <div className="item active selected" data-value="lastUpdate">Last updated</div>
            </div>;
        }
        else {
            return <div className="menu">
                <div className="item active selected" data-value="score">Relevance</div>
                <div className="item" data-value="lastUpdate">Last updated</div>
            </div>;
        }
    }
    render() {
        const results = this.props.results;
        const numFound = this.props.numFound;

        // define results div
        let resultsDiv = <div ref="resultsDiv">
            <div className="ui grid" key="resultsHeader">
                <div className="eight wide left floated column" key="resultsTitleDiv">
                    <h2 className="ui header">Search Results</h2> Showing {results.length} out of {numFound} results
                </div>
                <div className="eight wide right floated column" key="resultsSortDropdown">
                    <div className="ui right floated pointing labeled icon dropdown button" role="button" aria-haspopup="true" aria-label="Sort by" ref="sortDropdown" id="sortDropdown">
                        <i className="sort content ascending icon"/>
                        <div className="text">{(this.props.sort === 'lastUpdate') ? 'Last Updated' : 'Relevance'}</div>
                        {this.renderSortDropdownItems()}
                    </div>
                </div>
            </div>
            <div className="ui centered grid" key="searchResults">
                <div className="twelve wide column">
                    <SearchResultsList items={results} ></SearchResultsList>
                </div>
            </div>
        </div>;

        // define no results div
        let noResultsDiv = <div key="noResultsDiv" className="ui basic segment center aligned">
            <h3>No results found for the specified input parameters</h3>
        </div>;

        // define load more results div
        let loadMoreDiv = '';

        if(this.props.hasMore){
            let loadMoreContent = <button className="ui button" onClick={this.props.loadMore.bind(this)}>Load More</button>;
            if(this.props.loadMoreLoading){
                loadMoreContent = <div className="ui active text loader">Loading</div>;
            }
            loadMoreDiv = <div key="loadMoreDiv" className="ui basic segment center aligned">
                {loadMoreContent}
            </div>;
        }

        let resultsPanel = (numFound === 0) ? noResultsDiv : resultsDiv;
        let spellcheckDiv = <SpellcheckPanel spellcheckData={this.props.spellcheck} handleRedirect={this.props.handleRedirect} />;

        return (
            <div ref="searchResultsPanel">
                {spellcheckDiv}
                {resultsPanel}
                {loadMoreDiv}
            </div>
        );
    }
}

SearchResultsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SearchResultsPanel;
