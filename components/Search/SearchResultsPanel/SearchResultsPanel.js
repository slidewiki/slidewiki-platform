import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { NavLink } from 'fluxible-router';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';
import loadSearchResults from '../../../actions/search/loadSearchResults';
import updateUserResultsVisibility from '../../../actions/search/updateUserResultsVisibility';

class SearchResultsPanel extends React.Component {

    handleChangeToggle(field, value) {
        this.context.executeAction(updateUserResultsVisibility, {
            field: field,
            value: value
        });
    }

    render() {
        const results = this.props.SearchResultsStore.results;
        const entities = this.props.SearchResultsStore.entities;
        const languages = this.props.SearchResultsStore.languages;

        const entityList = entities.map((s, index) => {
            return (
                <div className="ui item toggle checkbox" key={index} >
                    <input name="toggleCheckbox" type="checkbox" defaultChecked={true} onChange={this.handleChangeToggle.bind(this, 'type', s.description)} />
                    <label>{s.description}</label>
                </div>
            );
        });

        const languageList = languages.map((s, index) => {
            return (
                <div className="ui item toggle checkbox" key={index} >
                    <input name="toggleCheckbox" type="checkbox" defaultChecked={true} onChange={this.handleChangeToggle.bind(this, 'lang', s.description)} />
                    <label>{s.description}</label>
                </div>
            );
        });

        return (

            <div ref="searchResultsPanel">

                <h2 className="ui header">
                    Search Results |
                    &nbsp;<NavLink className="item" href={'/search/advsearch'} activeClass="active">Advanced search</NavLink>
                </h2>

                <div className="ui grid">
                    <div className="five wide column">
                        <div className="ui basic segment">
                            <h4 className="ui header">Facets:</h4>
                            <label>Entities:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        {entityList}
                                    </div>
                                 </div>
                            </div>
                            <label>Languages:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        {languageList}
                                    </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                    <div className="ten wide column">
                        <div className="ui basic segment">
                            <SearchResultsList items={results} ></SearchResultsList>
                        </div>
                    </div>
                </div>
            </div>
		);
    }

}

SearchResultsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
SearchResultsPanel = connectToStores(SearchResultsPanel, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default SearchResultsPanel;
