import React from 'react';
import ContributorItem from './ContributorItem';

class ContributorsList extends React.Component {
    render() {
        let list = this.props.items.map((node, index)=> {
            return (
                <ContributorItem key={index} data={node} />
            );
        });
        return (
            <div ref="contributorsList">
                <div className="ui relaxed divided list">
                    {list}
                </div>
             </div>
        );
    }
}

export default ContributorsList;
