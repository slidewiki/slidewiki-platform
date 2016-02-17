import React from 'react';

class DataSourceList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <div className="item" key={index}>
                    <i className="ui icon file"></i>
                    <div className="content"> {node.title}</div>
                </div>
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
