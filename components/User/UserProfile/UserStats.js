import React from 'react';
import {Grid, Message, Segment, Table} from 'semantic-ui-react';
import updateUserStatsPeriod from '../../../actions/stats/updateUserStatsPeriod';
import updateUserStatsActivityType from '../../../actions/stats/updateUserStatsActivityType';
import {TagCloud} from 'react-tagcloud';
import {defineMessages} from 'react-intl';
import ActivityTimeline from '../../../components/Stats/ActivityTimeline';
import {PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer} from 'recharts';

import PropTypes from 'prop-types';

class UserStats extends React.Component {

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
            userEngagementTitle: {
                id: 'Stats.userEngagementTitle',
                defaultMessage: 'User Engagement Overview'
            },
            activeEngagement: {
                id: 'Stats.activeEngagement',
                defaultMessage: 'Active Engagement'
            },
            passiveEngagement: {
                id: 'Stats.passiveEngagement',
                defaultMessage: 'Passive Engagement'
            },
            socialEngagement: {
                id: 'Stats.socialEngagement',
                defaultMessage: 'Social Engagement'
            },
        });
    }

    handleDatePeriodChange(event, {value}) {
        this.context.executeAction(updateUserStatsPeriod, {
            datePeriod: value
        });
    }

    handleActivityTypeChange(event, {value}) {
        this.context.executeAction(updateUserStatsActivityType, {
            activityType: value
        });
    }

    render() {
        const customTagRenderer = (tag, size, color) => {
            return <span key={tag.value} style={{
                color,
                fontSize: size,
                margin: '5px',
                verticalAlign: 'middle',
                display: 'inline-block'
            }}>{tag.value}</span>;
        };

        let statsByTagRows = this.props.userStats.statsByTag.map((stat, index) => {
            return (
              <Table.Row key={index}>
                  <Table.Cell>{stat.value}</Table.Cell>
                  <Table.Cell>{stat.count}</Table.Cell>
              </Table.Row>
            );
        });

        let userEngagement = this.props.userStats.userEngagement;
        let activeEngagementMsg = this.context.intl.formatMessage(this.messages.activeEngagement);
        let passiveEngagementMsg = this.context.intl.formatMessage(this.messages.passiveEngagement);
        let socialEngagementMsg = this.context.intl.formatMessage(this.messages.socialEngagement);
        let radarData = [{
            type: activeEngagementMsg,
            value: userEngagement['active_engagement']
        }, {
            type: passiveEngagementMsg,
            value: userEngagement['passive_engagement']
        }, {
            type: socialEngagementMsg,
            value: userEngagement['social_engagement']
        }];

        let userEngagementRows = radarData.map((engagement, index) => {
            return (
              <Table.Row key={index}>
                  <Table.Cell>{engagement.type}</Table.Cell>
                  <Table.Cell>{engagement.value}</Table.Cell>
              </Table.Row>
            );
        });

        return (
          <Grid relaxed>
              {this.props.userStats.statsByTime && this.props.userStats.statsByTime.length > 0 &&
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <ActivityTimeline statsByTime={this.props.userStats.statsByTime}
                                        loading={this.props.userStats.statsByTimeLoading}
                                        activityType={this.props.userStats.activityType}
                                        datePeriod={this.props.userStats.datePeriod}
                                        handleActivityTypeChange={this.handleActivityTypeChange.bind(this)}
                                        handleDatePeriodChange={this.handleDatePeriodChange.bind(this)} />
                  </Grid.Column>
              </Grid.Row>}
              {this.props.userStats.statsByTag && this.props.userStats.statsByTag.length > 0 &&
              <Grid.Row centered columns={1}>
                  <Grid.Column>
                      <Message attached><h3>{this.context.intl.formatMessage(this.messages.tagCloudTitle)}</h3></Message>
                      <Segment aria-describedby='userStatsByTagTable' attached textAlign='center' padded='very'
                               loading={this.props.userStats.statsByTagLoading} aria-label='Data table for popular tags' tabIndex='0' aria-hidden='true'>
                          <TagCloud minSize={14} maxSize={38} tags={this.props.userStats.statsByTag} colorOptions={{luminosity: 'dark'}} renderer={customTagRenderer} />
                      </Segment>
                      <Table id='userStatsByTagTable' className="sr-only">
                          <Table.Header>
                              <Table.Row>
                                  <Table.HeaderCell>Tag</Table.HeaderCell>
                                  <Table.HeaderCell>Count</Table.HeaderCell>
                              </Table.Row>
                          </Table.Header>
                          <Table.Body>
                              {statsByTagRows}
                          </Table.Body>
                      </Table>
                  </Grid.Column>
              </Grid.Row>}
              {this.props.userStats.userEngagement &&
              <Grid.Row centered columns={1}>
                  <Grid.Column>
                      <Message attached><h3>{this.context.intl.formatMessage(this.messages.userEngagementTitle)}</h3></Message>
                      <Segment aria-describedby='userEngagementTable' attached textAlign='center' padded='very'
                               loading={this.props.userStats.userEngagementLoading} aria-label='Data table for user engagement overview' tabIndex='0' aria-hidden='true'>
                          <ResponsiveContainer height={300}>
                              <RadarChart outerRadius={100} data={radarData}>
                                  <PolarGrid />
                                  <PolarAngleAxis dataKey="type" />
                                  <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
                              </RadarChart>
                          </ResponsiveContainer>
                      </Segment>
                      <Table id='userEngagementTable' className="sr-only">
                          <Table.Header>
                              <Table.Row>
                                  <Table.HeaderCell>User Engagement Type</Table.HeaderCell>
                                  <Table.HeaderCell>Value</Table.HeaderCell>
                              </Table.Row>
                          </Table.Header>
                          <Table.Body>
                              {userEngagementRows}
                          </Table.Body>
                      </Table>
                  </Grid.Column>
              </Grid.Row>}
          </Grid>
        );
    }
}

UserStats.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default UserStats;
