import PropTypes from 'prop-types';
import React from 'react';
import UserPerformancePredictionItem from './UserPerformancePredictionItem';
import { connectToStores } from 'fluxible-addons-react';
import UserPerformancePredictionsStore from '../../../../stores/UserPerformancePredictionsStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import SelectDeckModal from './SelectDeckModal';
import { Header } from 'semantic-ui-react';

class UserPerformancePredictions extends React.Component {

    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
        this.refreshAccordion();
    }

    enableAccordion() {
        let accordionDIV = this.refs.predictionsList;
        $(accordionDIV).find('.ui.accordion').accordion({
            exclusive: false
        });
    }

    refreshAccordion() {
        const noOfPredictions = (this.props.UserPerformancePredictionsStore.predictions) ? this.props.UserPerformancePredictionsStore.predictions.length : 0;
        let accordionDIV = this.refs.predictionsList;
        for (let i = 0; i < noOfPredictions; i++) {
            $(accordionDIV).find('.ui.accordion').accordion('close', i);
        }
    }

    render() {
        const items = this.props.UserPerformancePredictionsStore.predictions ?  ((this.props.UserPerformancePredictionsStore.predictions.length > 0) ? this.props.UserPerformancePredictionsStore.predictions.map((prediction, index) => {
            return (
                <UserPerformancePredictionItem prediction={prediction} index={index} key={index} />
            );
        }) : 'There are no predictions') : '';
        const loading = (this.props.UserPerformancePredictionsStore.loading) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : '';
        return (
            <div className="ui segments">
                <div className="ui secondary clearing segment" >
                  <h2 className="ui left floated header medium" >Performance predictions</h2>
                  <SelectDeckModal />
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
    executeAction: PropTypes.func.isRequired
};

UserPerformancePredictions = connectToStores(UserPerformancePredictions, [UserPerformancePredictionsStore, UserProfileStore], (context, props) => {
    return {
        UserPerformancePredictionsStore: context.getStore(UserPerformancePredictionsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default UserPerformancePredictions;
