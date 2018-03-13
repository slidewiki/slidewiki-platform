import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';
import {formatDate} from '../../../Deck/ActivityFeedPanel/util/ActivityFeedUtil';

class UserpPerformancePredictionItem extends React.Component {

    render() {
        const prediction = this.props.prediction;
        const resultIcons = (!prediction.result) ? '' :
            (prediction.result < 50) ? (
                <div className="ui raised segment">
                    <i className="icon certificate big red"/>
                    <i className="icon circle outline large yellow"/>
                    <i className="icon circle outline large green"/>
                </div>
            ) : (prediction.result < 80) ? (
                <div>
                    <i className="icon circle outline large red"/>
                    <i className="icon certificate big yellow"/>
                    <i className="icon circle outline large green"/>
                </div>
            ) : (
                <div>
                    <i className="icon circle outline large green"/>
                    <i className="icon circle outline large yellow"/>
                    <i className="icon certificate big green"/>
                </div>
            );
        return (
            <List.Item className="ui raised segment" style={{border:0}}>
                <List.Content style={{width:'100%'}} tabIndex='0'>

                    <List.Description>
                        <div key={this.props.key} className="ui vertical segment" >
                            <div className="ui four column stackable grid container">

                                <div className="column">
                                    <div className="ui header"><h3>{prediction.title}</h3></div>
                                </div>
                                <div className="column">
                                    {(prediction.finished) ? 'Executed ' : 'Started '}
                                    {formatDate(prediction.started)}
                                </div>
                                <div className="column">
                                    {(prediction.result) ? 'Predicted result: ' + prediction.result : ''}
                                    {resultIcons}
                                </div>
                                <div className="column">
                                    {(prediction.accuracy) ? 'Accuracy: ' + Math.round(prediction.accuracy * 100) / 100 : ''}
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
