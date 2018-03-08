import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';

class UserpPerformancePredictionItem extends React.Component {

    render() {
        const prediction = this.props.prediction;

        return (
            <List.Item style={{border:0}}>
                <List.Content style={{width:'100%'}} tabIndex='0'>

                    <List.Description>

                        <div >
                            Id:
                            {prediction.id}
                        </div>
                        <div >
                            Deck title:
                            {prediction.title}
                        </div>
                        <div >
                            Deck id:
                            {prediction.deckId}
                        </div>
                        <div >
                            User id:
                            {prediction.userId}
                        </div>
                        <div >
                            Started:
                            {prediction.started}
                        </div>
                        <div >
                            Finished:
                            {prediction.finished}
                        </div>
                        <div >
                            Result:
                            {prediction.result}
                        </div>
                        <div >
                            Accuracy:
                            {prediction.accuracy}
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
