import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';
import loadSearchResults from '../../../actions/search/loadSearchResults';
import SpellcheckPanel from './SpellcheckPanel';
import loadMoreResults from '../../../actions/search/loadMoreResults';
import {FormattedMessage, defineMessages} from 'react-intl';
import { Grid } from 'semantic-ui-react';
import Facets from './Facets';

class SearchResultsPanel extends React.Component {
    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            relevanceSort: {
                id: 'SearchResultsPanel.sort.relevance',
                defaultMessage: 'Relevance'
            }, 
            lastUpdatedSort: {
                id: 'SearchResultsPanel.sort.lastUpdated',
                defaultMessage: 'Last updated'
            },
            header: {
                id: 'SearchResultsPanel.header',
                defaultMessage: 'Results'
            }, 
            noResults: {
                id: 'SearchResultsPanel.noResults',
                defaultMessage: 'No results found for the specified input parameters'
            }, 
            loadMore: {
                id: 'SearchResultsPanel.loadMore',
                defaultMessage: 'Load More'
            }, 
            loading: {
                id: 'SearchResultsPanel.loading',
                defaultMessage: 'Loading'
            }, 
            resultsMsg: {
                id: 'SearchResultsPanel.results.message', 
                defaultMessage: 'Displaying {resultsNum} out of {totalResults} results'
            }
        });
    }
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
                <div className="item" data-value="score"><FormattedMessage {...this.messages.relevanceSort} /></div>
                <div className="item active selected" data-value="lastUpdate"><FormattedMessage {...this.messages.lastUpdatedSort} /></div>
            </div>;
        }
        else {
            return <div className="menu">
                <div className="item active selected" data-value="score"><FormattedMessage {...this.messages.relevanceSort} /></div>
                <div className="item" data-value="lastUpdate"><FormattedMessage {...this.messages.lastUpdatedSort} /></div>
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
                    <h2 className="ui header"><FormattedMessage {...this.messages.header} /></h2> 
                    {
                        this.context.intl.formatMessage(this.messages.resultsMsg, {
                            resultsNum: results.length,
                            totalResults: numFound
                        })
                    }
                </div>
                <div className="eight wide right floated column" key="resultsSortDropdown">
                    <div className="ui right floated pointing labeled icon dropdown button" role="button" aria-haspopup="true" aria-label="Sort by" ref="sortDropdown" id="sortDropdown">
                        <i className="sort content ascending icon"/>
                        <div className="text">{(this.props.sort === 'lastUpdate') ? this.context.intl.formatMessage(this.messages.lastUpdatedSort) : this.context.intl.formatMessage(this.messages.relevanceSort)}</div>
                        {this.renderSortDropdownItems()}
                    </div>
                </div>
            </div>
            <SearchResultsList items={results} ></SearchResultsList>
        </div>;

        // define no results div
        let noResultsDiv = <div key="noResultsDiv" className="ui basic segment center aligned">
            <h3><FormattedMessage {...this.messages.noResults} /></h3>
        </div>;

        // define load more results div
        let loadMoreDiv = '';

        if(this.props.hasMore){
            let loadMoreContent = <button className="ui button" onClick={this.props.loadMore.bind(this)}><FormattedMessage {...this.messages.loadMore} /></button>;
            if(this.props.loadMoreLoading){
                loadMoreContent = <div className="ui active text loader"><FormattedMessage {...this.messages.loading} /></div>;
            }
            loadMoreDiv = <div key="loadMoreDiv" className="ui basic segment center aligned">
                {loadMoreContent}
            </div>;
        }

        let resultsPanel = (numFound === 0) ? noResultsDiv : resultsDiv;
        let spellcheckDiv = <SpellcheckPanel spellcheckData={this.props.spellcheck} handleRedirect={this.props.handleRedirect} />;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {spellcheckDiv}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <h2 className="ui header">Filters</h2>
                        <Facets data={this.props.facets} handleFacetClick={this.props.handleFacetClick} selectedFacets={this.props.selectedFacets} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {resultsPanel}
                        {loadMoreDiv}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

SearchResultsPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired,
};

export default SearchResultsPanel;
