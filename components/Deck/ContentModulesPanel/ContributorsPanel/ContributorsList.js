import React from 'react';
import ContributorItem from './ContributorItem';

class ContributorsList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <ContributorItem key={index} data={node} />
            );
        });
        return (
            <div ref="contributorsList" className="ui compact divided list">
                {list}
             </div>
        );
    }
}

export default ContributorsList;
