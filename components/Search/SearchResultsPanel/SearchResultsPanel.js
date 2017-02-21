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
    renderSpellcheckCollations(){
        return <div key="spellcheckDiv" className="ui grid container">
            <div className="row">
                <h4>Do you mean: {this.props.spellcheck.collations.map( (el) => {
                    return <a href='#' key={el} onClick={this.props.handleRedirect.bind(this, {keywords: el})}> {el} </a>;
                })}?</h4>
            </div>
        </div>;
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

        let noResultsDiv = <div key="noResultsDiv" className="ui grid centered container">
            <div className="row">
                <h3>No results found for the specified input parameters.</h3>
            </div>
        </div>;

        let spellcheckDiv = '';

        if(this.props.spellcheck.collations.length > 0){
            spellcheckDiv = this.renderSpellcheckCollations();
        }

        let resultsPanel = (numFound === 0) ? noResultsDiv : resultsDiv;

        return (
            <div ref="searchResultsPanel">
                {spellcheckDiv}
                {resultsPanel}
            </div>
        );
    }
}

SearchResultsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SearchResultsPanel;
