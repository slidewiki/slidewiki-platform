import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';
import loadSearchResults from '../../../actions/search/loadSearchResults';
import loadMoreResults from '../../../actions/search/loadMoreResults';
import {FormattedMessage, defineMessages} from 'react-intl';
import { Grid, Segment, Container } from 'semantic-ui-react';
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
            },
            error: {
                id: 'SearchResultsPanel.error', 
                defaultMessage: 'An error occured while fetching search results'                
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

        if (this.props.error) {
            return (
                <div className="ui grid centered">
                    <h3><FormattedMessage {...this.messages.error} /></h3>
                </div>
            );
        } else if (this.props.numFound === 0) {
            return (
                <div>
                    <div key="noResultsDiv" className="ui basic segment center aligned">
                        <h3><FormattedMessage {...this.messages.noResults} /></h3>
                    </div>
                </div>
            );
        }

        const loadingDiv = <div className="ui basic segment">
            <p></p>
            <p></p>
            <div className="ui active inverted dimmer">
                <div className="ui medium text loader">Loading</div>
            </div>
            <p></p>
            <p></p>
        </div>;

        // if we do not come from facets, also hide facets when loading
        if (this.props.loading && !this.props.fromFacets) {
            return loadingDiv;
        }

        // define load more results div
        let loadMoreDiv = '';
        if (this.props.hasMore) {
            let loadMoreContent = <button className="ui button" onClick={this.props.loadMore.bind(this)}><FormattedMessage {...this.messages.loadMore} /></button>;
            if (this.props.loadMoreLoading) {
                loadMoreContent = <div className="ui active text loader"><FormattedMessage {...this.messages.loading} /></div>;
            }
            loadMoreDiv = <div key="loadMoreDiv" className="ui basic segment center aligned">
                {loadMoreContent}
            </div>;
        }

        return (            
            <Grid>
                <div className="ui row" style={{paddingBottom: 0 + 'px', height: 4 + 'em'}}>
                    <Grid.Column width={4}>
                        <h2 className="ui header">Filters</h2>
                    </Grid.Column>
                    <Grid.Column width={12}>
                    {
                        (!this.props.loading) &&
                            <Grid>
                                <Grid.Row as='span'>
                                    <Grid.Column as='span' width={8} floated="left">
                                        <h2 className="ui header"><FormattedMessage {...this.messages.header} /></h2> 
                                        {
                                            this.context.intl.formatMessage(this.messages.resultsMsg, {
                                                resultsNum: results.length,
                                                totalResults: this.props.numFound
                                            })
                                        }
                                    </Grid.Column>
                                    <Grid.Column as='span' width={8} floated="left">
                                        <div className="ui right floated pointing labeled icon dropdown button" role="button" aria-haspopup="true" aria-label="Sort by" ref="sortDropdown" id="sortDropdown">
                                        <i className="sort content ascending icon"/>
                                        <div className="text">{(this.props.sort === 'lastUpdate') ? this.context.intl.formatMessage(this.messages.lastUpdatedSort) : this.context.intl.formatMessage(this.messages.relevanceSort)}</div>
                                        {this.renderSortDropdownItems()}
                                    </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                    }
                    </Grid.Column>
                </div>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Facets data={this.props.facets} handleFacetClick={this.props.handleFacetClick} selectedFacets={this.props.selectedFacets} clearFacets={this.props.clearFacets} loading={this.props.loading}/>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {
                            // if we are come from facets, then load only search results panel
                            (this.props.loading && this.props.fromFacets) ? (
                                loadingDiv
                            ) : (
                                <div ref="resultsDiv">
                                    <SearchResultsList items={results} />
                                    { loadMoreDiv }
                                </div>
                            )
                        }
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
