import React from 'react';
import DataSourceItem from './DataSourceItem';

class DataSourceList extends React.Component {
    render() {
        const selector = this.props.selector;

        const list = this.props.items.map((node, index) => {
            return (
                <DataSourceItem node={node} key={index} selector={selector}/>
            );
        });

        return (
            <div ref="datasourcesList">
                <div className="ui relaxed divided list">
                    {list}
                </div>
             </div>
        );
    }
}

export default DataSourceList;
