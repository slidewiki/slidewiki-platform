import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';

class UserpPerformancePredictionItem extends React.Component {

    render() {
        const prediction = this.props.prediction;
        const resultIcon = (!prediction.result) ? '' : (prediction.result < 50) ? (<i className="icon certificate red large"/>) : (prediction.result < 80) ? (<i className="icon certificate yellow large"/>) : (<i className="icon certificate green large"/>);
        return (
            <List.Item className="ui raised segment" style={{border:0}}>
                <List.Content style={{width:'100%'}} tabIndex='0'>

                    <List.Description>
                        <div key={this.props.key} className="ui vertical segment" >
                            <div className="ui five column stackable grid container">

                                <div className="column">
                                    <div className="ui header"><h3>{prediction.title}</h3></div>
                                </div>
                                <div className="column">
                                    Started:
                                    {prediction.started}
                                </div>
                                <div className="column">
                                    Finished:
                                    {prediction.finished}
                                </div>
                                <div className="column">
                                    Result:
                                    {prediction.result}
                                    {resultIcon}
                                </div>
                                <div className="column">
                                    Accuracy:
                                    {prediction.accuracy}
                                </div>
                            </div>
                        </div>

                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}
UserpPerformancePredictionItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserpPerformancePredictionItem;
