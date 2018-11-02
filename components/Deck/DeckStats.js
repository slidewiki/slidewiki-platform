import React from 'react';
import {Grid} from 'semantic-ui-react';

import updateDeckActivityTimelineFilters from '../../actions/stats/updateDeckActivityTimelineFilters';
import updateDeckUserStatsFilters from '../../actions/stats/updateDeckUserStatsFilters';

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
            deckUserStatsTitle: {
                id: 'Stats.deckUserStatsTitle',
                defaultMessage: 'User Activity'
            },
        });
    }

    handleTimelinePeriodChange(event, {value}) {
        this.context.executeAction(updateDeckActivityTimelineFilters, {
            datePeriod: value,
            deckId: this.props.deckId,
        });
    }

    handleTimelineActivityChange(event, {value}) {
        this.context.executeAction(updateDeckActivityTimelineFilters, {
            activityType: value,
            deckId: this.props.deckId,
        });
    }

    handleMembersStatsPeriodChange(event, {value}) {
        this.context.executeAction(updateDeckUserStatsFilters, {
            datePeriod: value,
            deckId: this.props.deckId,
        });
    }

    handleMembersStatsActivityChange(event, {value}) {
        this.context.executeAction(updateDeckUserStatsFilters, {
            activityType: value,
            deckId: this.props.deckId,
        });
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
                      <UserBarChart title={this.context.intl.formatMessage(this.messages.deckUserStatsTitle)} data={this.props.deckStats.deckUserStats}
                                    loading={this.props.deckStats.deckUserStatsLoading}
                                    activityType={this.props.deckStats.deckUserStatsFilters.activityType}
                                    datePeriod={this.props.deckStats.deckUserStatsFilters.datePeriod}
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
