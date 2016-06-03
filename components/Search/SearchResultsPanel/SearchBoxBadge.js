import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
// import SearchResultsStore from '../../stores/SearchResultsStore';
import SearchResultsStore from '../../../stores/SearchResultsStore';
let ReactDOM = require('react-dom');

class SearchBoxBadge extends React.Component {

    // handleRedirect(searchstring){
    //     this.context.executeAction(navigateAction, {
    //         //url: '/searchresults/' + searchstring
    //         url: '/searchresults/RDFisGood'
    //         // url: '/searchresults'
    //     });
    //     return false;
    // }
    render() {
        return (
            <div className="ui small icon input" ref="searchBox">
                <input type="text" placeholder="Search..." ref="searchstring" />
                <NavLink className="item right" routeName="searchresults" activeClass="active">
                    <i className="search link icon" ></i>
                </NavLink>
            </div>
        );
    }
}
// SearchBoxBadge.contextTypes = {
//     executeAction: React.PropTypes.func.isRequired
// };
// SearchBoxBadge = connectToStores(SearchBoxBadge, [SearchResultsStore], (context, props) => {
//     return {
//         SearchResultsStore: context.getStore(SearchResultsStore).getState()
//     };
// });

export default SearchBoxBadge;
