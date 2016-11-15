import React from 'react';
import SearchResultsItem from './SearchResultsItem';

class SearchResultsList extends React.Component {
    initAccordion(){
        $('.ui.accordion').accordion({
            selector: {
                trigger: '.title .button'
            }
        });
    }
    componentDidMount(){
        this.initAccordion();
    }
    componentDidUpdate(){
        this.initAccordion();
    }
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <SearchResultsItem key={index} data={node} />
            );
        });
        return (
            <div className="ui accordion fluid">
                {list}
            </div>
        );
    }
}

export default SearchResultsList;
