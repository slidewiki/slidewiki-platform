import React from 'react';
import UserPerformancePredictionItem from './UserPerformancePredictionItem';
import {List} from 'semantic-ui-react';
import { connectToStores } from 'fluxible-addons-react';
import UserPerformancePredictionsStore from '../../../../stores/UserPerformancePredictionsStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import addPerformancePredictionJob from '../../../../actions/analytics/addPerformancePredictionJob';

class UserPerformancePredictions extends React.Component {
    handleCLickNewPrediction(e) {
        e.preventDefault();




        //IMPLEMENT DECK SELECTION
        let deckId = 2000;
        let deckTitle = 'testTitle';
        let deckFirstSlide = '14176-2'
        let deckTheme = 'default';





        let userId = this.props.UserProfileStore.userid;
        let started = new Date();
        let prediction = {
            userId: userId,
            deckId: deckId,
            title: deckTitle,
            started: started,
            deckTheme: deckTheme,
            deckFirstSlide: deckFirstSlide
        }
        this.context.executeAction(addPerformancePredictionJob, {prediction: prediction});
    }

    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
        this.refreshAccordion();
    }

    enableAccordion(status) {
        let accordionDIV = this.refs.predictionsList;
        $(accordionDIV).find('.ui.accordion').accordion({
            exclusive: false
        });
    }

    refreshAccordion(status) {
        let accordionDIV = this.refs.predictionsList;
        $(accordionDIV).find('.ui.accordion').accordion('refresh');
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
                      <p>New prediction job</p>
                  </button>
              </div>

              {loading}

              <div className="ui vertical segment" ref="predictionsList">
                  <div className="ui styled fluid accordion">
                      {items}
                  </div>
              </div>
            </div>
        );


    }
}

UserPerformancePredictions.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

UserPerformancePredictions = connectToStores(UserPerformancePredictions, [UserPerformancePredictionsStore, UserProfileStore], (context, props) => {
    return {
        UserPerformancePredictionsStore: context.getStore(UserPerformancePredictionsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});


export default UserPerformancePredictions;
