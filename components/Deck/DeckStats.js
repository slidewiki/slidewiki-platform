import React from 'react';
import {Grid} from 'semantic-ui-react';

// import updateDeckActivityTimelineFilters from '../../actions/stats/updateDeckActivityTimelineFilters';
// import updateDeckUsersStatsFilters from '../../actions/stats/updateDeckUsersStatsFilters';

import {defineMessages} from 'react-intl';
import ActivityTimeline from '../../components/Stats/ActivityTimeline';
import UserBarChart from '../../components/Stats/UserBarChart';


import PropTypes from 'prop-types';

class DeckStats extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }

    getIntlMessages() {
        return defineMessages({
            membersStatsTitle: {
                id: 'Stats.deckUsersStatsTitle',
                defaultMessage: 'User Activity'
            },
        });
    }

    handleTimelinePeriodChange(event, {value}) {
        // TODO
        // this.context.executeAction(updateDeckActivityTimelineFilters, {
        //     datePeriod: value,
        //     deckid: this.props.deckid,
        // });
    }

    handleTimelineActivityChange(event, {value}) {
        // TODO
        // this.context.executeAction(updateDeckActivityTimelineFilters, {
        //     activityType: value,
        //     deckid: this.props.deckid,
        // });
    }

    handleMembersStatsPeriodChange(event, {value}) {
        // TODO
        // this.context.executeAction(updateDeckUsersStatsFilters, {
        //     datePeriod: value,
        //     deckid: this.props.deckid,
        // });
    }

    handleMembersStatsActivityChange(event, {value}) {
        // TODO
        // this.context.executeAction(updateDeckUsersStatsFilters, {
        //     activityType: value,
        //     deckid: this.props.deckid,
        // });
    }

    render() {
        return (
          <Grid relaxed>
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <ActivityTimeline statsByTime={this.props.deckStats.statsByTime}
                                        loading={this.props.deckStats.statsByTimeLoading}
                                        activityType={this.props.deckStats.timelineFilters.activityType}
                                        datePeriod={this.props.deckStats.timelineFilters.datePeriod}
                                        handleActivityTypeChange={this.handleTimelineActivityChange.bind(this)}
                                        handleDatePeriodChange={this.handleTimelinePeriodChange.bind(this)} />
                  </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <UserBarChart title={this.context.intl.formatMessage(this.messages.membersStatsTitle)} data={this.props.deckStats.membersStats}
                                    loading={this.props.deckStats.membersStatsLoading}
                                    activityType={this.props.deckStats.membersStatsFilters.activityType}
                                    datePeriod={this.props.deckStats.membersStatsFilters.datePeriod}
                                    handleActivityTypeChange={this.handleMembersStatsActivityChange.bind(this)}
                                    handleDatePeriodChange={this.handleMembersStatsPeriodChange.bind(this)} />
                  </Grid.Column>
              </Grid.Row>
          </Grid>
        );
    }
}

DeckStats.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default DeckStats;
