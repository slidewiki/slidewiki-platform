import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DataSourceStore from '../../../stores/DataSourceStore';
import DataSourceList from './DataSourceList';

class DataSourcePanel extends React.Component {
    render() {
        let dataSources = this.props.DataSourceStore.datasources;

        const style= {
            'maxHeight': '300px',
            'overflowY': 'auto'
        };
        return (
            <div className="ui segments" ref="dataSourcePanel">
                <div className="ui secondary segment">
                    <a href="/datasource/deck/57">Data Sources</a> ({dataSources.length})
                </div>
                <div className="ui orange segment" style={style}>
                    <DataSourceList items={dataSources} />
                </div>
            </div>
        );
    }
  }

DataSourcePanel = connectToStores(DataSourcePanel, [DataSourceStore], (context, props) => {
    return {
        DataSourceStore: context.getStore(DataSourceStore).getState()
    };
});

export default DataSourcePanel;
