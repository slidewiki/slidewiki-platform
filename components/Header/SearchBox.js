import React from 'react';

class SearchBox extends React.Component {
    render() {
        return (
            <div className="ui small icon input" ref="searchBox">
                <input type="text" placeholder="Search..." />
                <i className="search link icon"></i>
            </div>
        );
    }
}

export default SearchBox;
