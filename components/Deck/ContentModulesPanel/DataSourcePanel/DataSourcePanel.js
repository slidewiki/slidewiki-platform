import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DataSourceStore from '../../../../stores/DataSourceStore';
import DataSourceList from './DataSourceList';
import ShadowScrollbars from './Scrollbars/ShadowScrollbars';
import saveDataSource from '../../../../actions/datasource/saveDataSource';
import cancelEditDataSource from '../../../../actions/datasource/cancelEditDataSource';

class DataSourcePanel extends React.Component {
    handleCancelClick() {
        this.context.executeAction(cancelEditDataSource);
    }

    handleSave() {
        let dataSource = this.props.DataSourceStore.datasource;
        //read form data
        dataSource.title = this.refs.title.value;
        dataSource.url = this.refs.url.value;
        dataSource.comment = this.refs.comment.value;
        this.context.executeAction(saveDataSource, {
            datasource: dataSource
        });
    }
    render() {
        const dataSources = this.props.DataSourceStore.datasources;
        const dataSource = this.props.DataSourceStore.datasource;
        const selector = this.props.DataSourceStore.selector;

        let content = (
              <div>
                  <ShadowScrollbars style={{height:300}} >
                      <DataSourceList items={dataSources} selector={selector}/>
                  </ShadowScrollbars>
              </div>
        );

        if (dataSource !== undefined && dataSource !== null) {//dataSource is selected -> show its data
            content = (
                <div>
                    <div className="ui secondary segment">
                        Edit Data Source
                    </div>
                    <div className="ui orange segment" >
                        <form className="ui edit form">
                            <div className="ui label" >
                                Title
                            </div>
                            <div className="ui fluid input">
                                <input type="text" ref="title" defaultValue={dataSource.title} />
                            </div>
                            <div className="ui label" >
                                URL
                            </div>
                            <div className="ui fluid input">
                                <input type="text" ref="url" defaultValue={dataSource.url}/>
                            </div>
                            <div className="ui label" >
                                Comment
                            </div>
                            <div className="ui fluid input">
                                <input type="text" ref="comment" defaultValue={dataSource.comment}/>
                            </div>
                            <div className="ui hidden divider"></div>
                            <div tabIndex="0" onClick={this.handleCancelClick.bind(this)} className="ui labeled icon button">
                                <i className="chevron left icon"></i> Cancel
                            </div>
                            <div tabIndex="0" className="ui primary submit labeled icon button" onClick={this.handleSave.bind(this)}>
                                <i className="checkmark icon"></i> Save
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
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
