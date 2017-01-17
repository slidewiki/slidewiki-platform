import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { NavLink } from 'fluxible-router';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';
import loadSearchResults from '../../../actions/search/loadSearchResults';

class SearchResultsPanel extends React.Component {

    initSortDropdown(){
        let changeSort = this.props.handleRedirect.bind(this);
        $('#sortDropdown').dropdown({
            onChange: function(value, text, $choice){
                changeSort({
                    sort: value
                });
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

        let resultsDiv = <div ref="resultsDiv">
            <div className="ui grid" key="resultsHeader">
                <div className="eight wide left floated column" key="resultsTitleDiv">
                    <h2 className="ui header">Search Results</h2>
                </div>
                <div className="eight wide right floated column" key="resultsSortDropdown">
                    <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown" id="sortDropdown">
                        <i className="icon exchange"/>
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

        let noResultsDiv = <div key="noResiltsDiv">
            <div className="ui grid centered">
                <h3>No results found for the specified input parameters.</h3>
            </div>
        </div>;

        let resultsPanel = (numFound === 0) ? noResultsDiv : resultsDiv;

        return (
            <div ref="searchResultsPanel">
                {resultsPanel}
            </div>
        );
    }
}

SearchResultsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SearchResultsPanel;
