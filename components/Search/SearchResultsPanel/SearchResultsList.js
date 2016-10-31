import React from 'react';
import SearchResultsItem from './SearchResultsItem';

class SearchResultsList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <SearchResultsItem key={index} data={node} />
            );
        });
        return (
                <div className="ui relaxed list">
                    {list}
                </div>

        );
    }
}

export default SearchResultsList;
