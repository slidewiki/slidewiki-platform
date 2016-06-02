import React from 'react';
import { NavLink } from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SearchResultsStore from '../../../stores/SearchResultsStore';
import SearchResultsItem from './SearchResultsItem';
import loadSearchResults from '../../../actions/search/loadSearchResults';

class SearchBoxBadge extends React.Component {
    componentDidMount() {
        this.context.executeAction(loadSearchResults, {
            
        });
        this.enablePopup();
    }
    componentDidUpdate(){
        this.enablePopup();
    }
    enablePopup() {
        let searchBoxBadge = this.refs.searchBoxBadge;
        const visible = true;
        if (visible) {
            $(searchBoxBadge).popup({
                inline   : true,
                hoverable: true,
                on: 'hover',
                position : 'bottom left',
                delay: {
                    show: 100,
                    hide: 300
                }
            });
        }
    }

    removePopupIfNeeded() {
        let searchBoxBadge = this.refs.searchBoxBadge;
        // const visible = (this.props.UserNotificationsStore.newNotificationsCount > 0);
        const visible = true;
        if (!visible) {
            $(notificationsBadge).popup('destroy');
        }
    }

    hidePopup() {
        let searchBoxBadge = this.refs.searchBoxBadge;
        $(searchBoxBadge).popup('hide');
        return true;
    }

    render() {
        const selector = this.props.selector;

        let noResultsMessage = '';

        const results = this.props.SearchResultsStore.results;
        const list = results.map((node, index) => {
            return (
                <SearchResultsItem key={index} data={node} />
            );
        });

        return (
            <div onMouseOver={this.removePopupIfNeeded.bind(this)}>
                <div ref="searchBoxBadge" onClick={this.hidePopup.bind(this)}>
                    <div className="ui small icon input" ref="searchBox">
                        <input type="text" placeholder="Search..." />
                        <NavLink className="item right" routeName="results" navParams={{uid:57}} activeClass="active">
                            <i className="search link icon" ></i>
                        </NavLink>
                    </div>
                </div>
                <div id="popup" className="ui special flowing popup">
                    <h5>Search results</h5>
                    <div ref="resultsList">
                        <div className="ui relaxed divided list">
                            {list}
                        </div>
                        <div >
                            {noResultsMessage}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SearchBoxBadge.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
SearchBoxBadge = connectToStores(SearchBoxBadge, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});
export default SearchBoxBadge;
