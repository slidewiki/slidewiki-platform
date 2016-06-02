import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsList from './SearchResultsList';


class SearchPanel extends React.Component {

    render() {
        const results = this.props.SearchResultsStore.results;


        const infoStyles = {
            fontWeight: 600
        };

        return (

            <div ref="searchResultsPanel">


                <div className="ui top attached secondary pointing menu">
                    <a className="item active" href="/results">Showing results for: {this.props.SearchResultsStore.query}</a>
                </div>

                <div className="ui grid">
                    <div className="five wide column">
                        <div className="ui basic segment">
                            <h4 className="ui header">Filters:</h4>
                            <label>Users:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        hello1
                                    </div>
                                 </div>
                            </div>
                            <label>Slides:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        hello2
                                    </div>
                                 </div>
                            </div>
                            <label>Decks:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        hello
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

SearchPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
SearchPanel = connectToStores(SearchPanel, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default SearchPanel;
