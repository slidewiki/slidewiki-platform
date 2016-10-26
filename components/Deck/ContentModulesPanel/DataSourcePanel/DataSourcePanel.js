import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DataSourceStore from '../../../../stores/DataSourceStore';
import DataSourceList from './DataSourceList';
import EditDataSource from './EditDataSource';
import ShadowScrollbars from './Scrollbars/ShadowScrollbars';
import newDataSource from '../../../../actions/datasource/newDataSource';

class DataSourcePanel extends React.Component {
    handleNewDataSource() {
        this.context.executeAction(newDataSource, {
        });
    }

    render() {
        const dataSources = this.props.DataSourceStore.datasources;
        const dataSource = this.props.DataSourceStore.datasource;
        const selector = this.props.DataSourceStore.selector;

        let content = ((dataSource === undefined) //dataSource is not selected -> show list
            ?
            <span><ShadowScrollbars style={{height:300}} >
                <DataSourceList items={dataSources} selector={selector}/>
            </ShadowScrollbars>
            <div className="ui hidden divider"></div>
            <button tabIndex="0" onClick={this.handleNewDataSource.bind(this)} className="ui blue labeled icon button">
                <i className="icon edit"></i> New Data Source
            </button>
            </span>
            :
            <EditDataSource dataSource={dataSource}/>
        );

        return (
            <div className="ui bottom attached" ref="dataSourcePanel">
                {content}
            </div>
        );
    }
}

DataSourcePanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

DataSourcePanel = connectToStores(DataSourcePanel, [DataSourceStore], (context, props) => {
    return {
        DataSourceStore: context.getStore(DataSourceStore).getState()
    };
});

export default DataSourcePanel;
