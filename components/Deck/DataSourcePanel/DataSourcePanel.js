import React from 'react';

class DataSourcePanel extends React.Component {
    render() {
        return (
            <div className="ui segments" ref="dataSourcePanel">
                <div className="ui secondary segment">
                    <a href="/datasources/deck/57">Data Sources</a>
                </div>
                <div className="ui orange segment">
                    <div className="ui divided list">
                        <div className="item">
                            <i className="ui icon file"></i>
                            <div className="content"> source 1</div>
                        </div>
                        <div className="item">
                            <i className="ui icon file"></i>
                            <div className="content"> source 2</div>
                        </div>
                        <div className="item">
                            <i className="ui icon file"></i>
                            <div className="content"> source 3</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DataSourcePanel;
