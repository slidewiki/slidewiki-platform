import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';
import loadSearchResults from '../../../actions/search/loadSearchResults';
import {FormattedMessage, defineMessages} from 'react-intl';
import { Grid, Button, Icon, Segment } from 'semantic-ui-react';
import Facets from './Facets';
import Responsive from 'react-responsive';
import MobileResultsList from './MobileResultsList';
import { isEmpty } from 'lodash';
import { NavLink } from 'fluxible-router';

const Default = (props) => <Responsive {...props} minWidth={1000} />;
const Mobile = (props) => <Responsive {...props} maxWidth={1000} />;

class SearchResultsPanel extends React.Component {
    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
        this.state = {
            showSidebar: false,
        };
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
            }, 
            filters: {
                id: 'SearchResultsPanel.filters', 
                defaultMessage: 'Filters'           
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
        $(this.refs.menubar).sidebar({ 'silent': true, 'transition': 'push', 'mobileTransition': 'push' });

    }
    componentDidUpdate(){
        this.initSortDropdown();
    }
    toggleSidebar() {
        $(this.refs.menubar).sidebar('toggle');
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
    closeSidebar(event) {
        $(this.refs.menubar).sidebar('hide');
    }
    handleFacetClickSidebar(params) {
        this.props.handleFacetClick(params);
        this.closeSidebar();
    }
    clearAll() {
        this.props.clearFacets('all');
    }
    isEmptyFacets(facets) {
        return (isEmpty(facets.language) && isEmpty(facets.user) && isEmpty(facets.tags));
    }
    render() {
        const results = this.props.results;

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

        let resultsHeader = '';
        if (!this.props.loading) {
            resultsHeader = <Grid>
                <Grid.Row as='span'>
                    <Grid.Column as='span' width={8} floated="left">
                        <Default>
                            <h2 className="ui header"><FormattedMessage {...this.messages.header} /></h2> 
                            {
                                this.context.intl.formatMessage(this.messages.resultsMsg, {
                                    resultsNum: results.length,
                                    totalResults: this.props.numFound
                                })
                            }
                        </Default>
                        <Mobile>
                            <Button onClick={this.toggleSidebar.bind(this)}>
                                <Icon name="filter" aria-label="show filters"/>
                                {this.context.intl.formatMessage(this.messages.filters)}
                            </Button>
                        </Mobile>
                    </Grid.Column>
                    <Grid.Column as='span' width={8} floated="left">
                        <div className="ui right floated pointing labeled icon dropdown button" role="button" aria-haspopup="true" aria-label="Sort by" ref="sortDropdown" id="sortDropdown">
                        <i className="sort content ascending icon"/>
                        <div className="text">{(this.props.sort === 'lastUpdate') ? this.context.intl.formatMessage(this.messages.lastUpdatedSort) : this.context.intl.formatMessage(this.messages.relevanceSort)}</div>
                        {this.renderSortDropdownItems()}
                    </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>;
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

        let showLoading = (this.props.loading && !this.props.fromFacets);
        let showClearAll = (!isEmpty(this.props.selectedFacets.languages) || !isEmpty(this.props.selectedFacets.tags) || !isEmpty(this.props.selectedFacets.users));
        let emptyFacets = this.isEmptyFacets(this.props.facets);

        return (       
            <div>     
            {
                (this.props.error) &&
                    <div className="ui grid centered">
                        <h3><FormattedMessage {...this.messages.error} /></h3>
                    </div>
            }
            {
                (this.props.numFound === 0 && emptyFacets) &&
                    <div>
                        <div key="noResultsDiv" className="ui basic segment center aligned">
                            <h3><FormattedMessage {...this.messages.noResults} /></h3>
                        </div>
                    </div>
            }
            {
                (showLoading) &&
                    loadingDiv
            }
            {
                (!showLoading && !this.props.error && !emptyFacets) &&
                <div>
                    <Grid>
                        <Default>
                            <div className="ui row" style={{paddingBottom: 0 + 'px', height: 4 + 'em'}}>
                                <Grid.Column width={4}>
                                    <h2 className="ui header"><FormattedMessage {...this.messages.filters} /></h2> 
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    { 
                                        (this.props.numFound === 0)
                                            ?   <div key="noResultsDiv" className="ui basic segment center aligned">
                                                    <h3><FormattedMessage {...this.messages.noResults} /></h3>
                                                </div>
                                            : resultsHeader
                                    }
                                </Grid.Column>
                            </div>
                        </Default>
                        <Mobile>
                            <div className="ui row" style={{paddingBottom: 0 + 'px', height: 4 + 'em'}}>
                                <Grid.Column width={16}>
                                    { 
                                        (this.props.numFound === 0)
                                            ?   <div key="noResultsDiv" className="ui basic segment center aligned">
                                                    <h3><FormattedMessage {...this.messages.noResults} /></h3>
                                                </div>
                                            : resultsHeader
                                    }
                                </Grid.Column>
                            </div>
                        </Mobile>
                        <Default>
                            <Grid.Row>
                                <Grid.Column width={4}>
                                    <Facets data={this.props.facets} handleFacetClick={this.props.handleFacetClick} selectedFacets={this.props.selectedFacets} clearFacets={this.props.clearFacets} loading={this.props.loading} request={this.props.request}/>
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
                        </Default>
                        <Mobile>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    { 
                                        (this.props.loading && this.props.fromFacets) ? (
                                            loadingDiv
                                        ) : (
                                            <div ref="resultsDiv">
                                                <MobileResultsList items={results} />
                                                { loadMoreDiv }
                                            </div>
                                        )
                                    }
                                </Grid.Column>
                            </Grid.Row>  
                        </Mobile>
                    </Grid>
                    <Mobile>
                        <div className="ui left dimmed sidebar vertical menubar" ref="menubar" >
                            <Segment basic>
                                <h2 className="ui header">{this.context.intl.formatMessage(this.messages.filters)}</h2>
                                <Facets data={this.props.facets} handleFacetClick={this.handleFacetClickSidebar.bind(this)} selectedFacets={this.props.selectedFacets} clearFacets={this.props.clearFacets} loading={this.props.loading}/>
                            </Segment>
                        </div>
                    </Mobile>
                </div>
            }
            </div>
        );
    }
}

SearchResultsPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired,
};

export default SearchResultsPanel;
