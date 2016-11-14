import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { NavLink } from 'fluxible-router';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';
import loadSearchResults from '../../../actions/search/loadSearchResults';
import updateUserResultsVisibility from '../../../actions/search/updateUserResultsVisibility';

class SearchResultsPanel extends React.Component {
    changePage(){
        context.executeAction(loadSearchResults, {page: 'next'});
    }
    render() {
        const results = this.props.results;  //this.props.SearchResultsStore.results;
        const numFound = this.props.numFound;
        const entities = this.props.entities;
        const languages = this.props.languages;

        const entityList = entities.map((s, index) => {
            return (
                <div className="ui item toggle checkbox" key={index} >
                    <input name="toggleCheckbox" type="checkbox" defaultChecked={true} /*onChange={this.handleChangeToggle.bind(this, 'type', s.description)}*/ />
                    <label>{s.description}</label>
                </div>
            );
        });

        const languageList = languages.map((s, index) => {
            return (
                <div className="ui item toggle checkbox" key={index} >
                    <input name="toggleCheckbox" type="checkbox" defaultChecked={true} /*onChange={this.handleChangeToggle.bind(this, 'lang', s.description)}*/ />
                    <label>{s.description}</label>
                </div>
            );
        });

        let resultsDiv = <div ref="resultsDiv">
            <h2 className="ui header">Search Results</h2>
            <div className="ui centered grid">
                <div className="twelve wide column">
                    <SearchResultsList items={results} ></SearchResultsList>
                </div>
            </div>
        </div>;

        let noResultsDiv = <div ref="noResiltsDiv">
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
// SearchResultsPanel = connectToStores(SearchResultsPanel, [SearchResultsStore], (context, props) => {
//     return {
//         SearchResultsStore: context.getStore(SearchResultsStore).getState()
//     };
// });

export default SearchResultsPanel;
