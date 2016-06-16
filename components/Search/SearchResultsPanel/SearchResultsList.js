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
            <div className="ui item" style={{ margin: '1em 0'}}>
                <div className="ui relaxed divided list">
                    {list}
                </div>
             </div>
        );
    }
}

export default SearchResultsList;
