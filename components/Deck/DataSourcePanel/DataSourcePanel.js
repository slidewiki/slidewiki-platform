import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DataSourceStore from '../../../stores/DataSourceStore';
import DataSourceList from './DataSourceList';
import ShadowScrollbars from './Scrollbars/ShadowScrollbars';

class DataSourcePanel extends React.Component {
    render() {
        const dataSources = this.props.DataSourceStore.datasources;
        const selector = this.props.DataSourceStore.selector;

        return (
            <div className="ui segments" ref="dataSourcePanel">
                <div className="ui secondary segment">
                    <NavLink href={'/datasource/'+ selector.stype + '/' + selector.sid}>Data Sources</NavLink> ({dataSources.length})
                </div>
                <div className="ui orange segment" >
                    <ShadowScrollbars style={{height:300}} >
                        <DataSourceList items={dataSources} />
                    </ShadowScrollbars>
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
