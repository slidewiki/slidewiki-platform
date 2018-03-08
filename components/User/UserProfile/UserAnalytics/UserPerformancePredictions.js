import React from 'react';
import UserPerformancePredictionItem from './UserPerformancePredictionItem';
import {List} from 'semantic-ui-react';
import { connectToStores } from 'fluxible-addons-react';
import UserPerformancePredictionsStore from '../../../../stores/UserPerformancePredictionsStore';

class UserPerformancePredictions extends React.Component {
    handleCLickNewPrediction(e) {
        e.preventDefault();
        // this.context.executeAction(updateUsergroup, {group: {}, offline: true});
        // this.context.executeAction(navigateAction, {
        //     url: '/user/' + this.props.username + '/groups/edit'
        // });
    }

    render() {

        const items = this.props.UserPerformancePredictionsStore.predictions ?  ((this.props.UserPerformancePredictionsStore.predictions.length > 0) ? this.props.UserPerformancePredictionsStore.predictions.map((prediction, index) => {
            return (
                <UserPerformancePredictionItem prediction={prediction} key={index} />
            );
        }) : 'There are no predictions') : '';
        const loading = (this.props.UserPerformancePredictionsStore.loading) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : '';
        return (
            <div className="ui segments">
                <div className="ui secondary clearing segment" >
                  <h3 className="ui left floated header" >Performance predictions</h3>
                  <button className="ui right floated labeled icon button" role="button" tabIndex="0" onClick={this.handleCLickNewPrediction.bind(this)}>
                      <i className="icon chart bar"/>
                      <p>Create new prediction job</p>
                  </button>
              </div>

              {loading}

              <div className="ui vertical segment">
                  {items}
              </div>
            </div>
        );


    }
}

UserPerformancePredictions = connectToStores(UserPerformancePredictions, [UserPerformancePredictionsStore], (context, props) => {
    return {
        UserPerformancePredictionsStore: context.getStore(UserPerformancePredictionsStore).getState()
    };
});


export default UserPerformancePredictions;
