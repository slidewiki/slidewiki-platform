import React from 'react';
import {Grid} from 'semantic-ui-react';
import updateGroupStatsPeriod from '../../actions/stats/updateGroupStatsPeriod';
import updateGroupStatsActivityType from '../../actions/stats/updateGroupStatsActivityType';
import {defineMessages} from 'react-intl';
import ActivityTimeline from '../../components/Stats/ActivityTimeline';


import PropTypes from 'prop-types';

class GroupStats extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }

    getIntlMessages() {
        return defineMessages({
            tagCloudTitle: {
                id: 'Stats.tagCloudTitle',
                defaultMessage: 'Popular Tags'
            },
        });
    }

    handleDatePeriodChange(event, {value}) {
        this.context.executeAction(updateGroupStatsPeriod, {
            datePeriod: value,
            groupid: this.props.groupid,
        });
    }

    handleActivityTypeChange(event, {value}) {
        this.context.executeAction(updateGroupStatsActivityType, {
            activityType: value,
            groupid: this.props.groupid,
        });
    }

    render() {
        return (
          <Grid relaxed>
              {this.props.groupStats.statsByTime && this.props.groupStats.statsByTime.length > 0 &&
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <ActivityTimeline statsByTime={this.props.groupStats.statsByTime}
                                        loading={this.props.groupStats.statsByTimeLoading}
                                        activityType={this.props.groupStats.activityType}
                                        datePeriod={this.props.groupStats.datePeriod}
                                        handleActivityTypeChange={this.handleActivityTypeChange.bind(this)}
                                        handleDatePeriodChange={this.handleDatePeriodChange.bind(this)} />
                  </Grid.Column>
              </Grid.Row>}
          </Grid>
        );
    }
}

GroupStats.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default GroupStats;
