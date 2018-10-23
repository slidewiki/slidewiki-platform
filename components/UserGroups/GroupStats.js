import React from 'react';
import {Grid} from 'semantic-ui-react';
import updateGroupActivityTimelineFilters from '../../actions/stats/updateGroupActivityTimelineFilters';
import updateGroupMembersStatsFilters from '../../actions/stats/updateGroupMembersStatsFilters';

import {defineMessages} from 'react-intl';
import ActivityTimeline from '../../components/Stats/ActivityTimeline';
import UserBarChart from '../../components/Stats/UserBarChart';


import PropTypes from 'prop-types';

class GroupStats extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }

    getIntlMessages() {
        return defineMessages({
            membersStatsTitle: {
                id: 'Stats.membersStatsTitle',
                defaultMessage: 'Member Activity'
            },
        });
    }

    handleTimelinePeriodChange(event, {value}) {
        this.context.executeAction(updateGroupActivityTimelineFilters, {
            datePeriod: value,
            groupid: this.props.groupid,
        });
    }

    handleTimelineActivityChange(event, {value}) {
        this.context.executeAction(updateGroupActivityTimelineFilters, {
            activityType: value,
            groupid: this.props.groupid,
        });
    }

    handleMembersStatsPeriodChange(event, {value}) {
        this.context.executeAction(updateGroupMembersStatsFilters, {
            datePeriod: value,
            groupid: this.props.groupid,
        });
    }

    handleMembersStatsActivityChange(event, {value}) {
        this.context.executeAction(updateGroupMembersStatsFilters, {
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
                                        activityType={this.props.groupStats.timelineFilters.activityType}
                                        datePeriod={this.props.groupStats.timelineFilters.datePeriod}
                                        handleActivityTypeChange={this.handleTimelineActivityChange.bind(this)}
                                        handleDatePeriodChange={this.handleTimelinePeriodChange.bind(this)} />
                  </Grid.Column>
              </Grid.Row>}
              {this.props.groupStats.membersStats && this.props.groupStats.membersStats.length > 0 &&
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <UserBarChart title={this.context.intl.formatMessage(this.messages.membersStatsTitle)} data={this.props.groupStats.membersStats}
                                    loading={this.props.groupStats.statsByTimeLoading}
                                    activityType={this.props.groupStats.membersStatsFilters.activityType}
                                    datePeriod={this.props.groupStats.membersStatsFilters.datePeriod}
                                    handleActivityTypeChange={this.handleMembersStatsActivityChange.bind(this)}
                                    handleDatePeriodChange={this.handleMembersStatsPeriodChange.bind(this)} />
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
