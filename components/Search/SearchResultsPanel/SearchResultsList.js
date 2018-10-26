import React from 'react';
import SearchResultsItem from './SearchResultsItem';
import { Grid } from 'semantic-ui-react';

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
            node.index = index;
            return (
                <SearchResultsItem key={index} data={node} />
            );
        });
        return (
            <Grid verticalAlign="middle" className="items" role="list" aria-expanded="true">
                {list}
            </Grid>
        );
    }
}

export default SearchResultsList;
