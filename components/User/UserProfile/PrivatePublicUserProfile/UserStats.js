import React from 'react';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Dropdown, Grid, Message, Segment, Table} from 'semantic-ui-react';
import moment from 'moment';
import updateUserStatsPeriod from '../../../../actions/stats/updateUserStatsPeriod';
import updateUserStatsActivityType from '../../../../actions/stats/updateUserStatsActivityType';
import {TagCloud} from 'react-tagcloud';
import {defineMessages} from 'react-intl';


import PropTypes from 'prop-types';

class UserStats extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }

    getIntlMessages() {
        return defineMessages({
            activityTimelineTitle: {
                id: 'Stats.activityTimelineTitle',
                defaultMessage: 'Activity Timeline'
            },
            tagCloudTitle: {
                id: 'Stats.tagCloudTitle',
                defaultMessage: 'Popular Tags'
            },
            last7Days: {id: 'Stats.period.last7Days', defaultMessage: 'Last 7 days'},
            last30Days: {id: 'Stats.period.last30Days', defaultMessage: 'Last 30 days'},
            last2Months: {id: 'Stats.period.last2Months', defaultMessage: 'Last 2 months'},
            last6Months: {id: 'Stats.period.last6Months', defaultMessage: 'Last 6 months'},
            last1Year: {id: 'Stats.period.last1Year', defaultMessage: 'Last 1 year'},
            last2Years: {id: 'Stats.period.last2Years', defaultMessage: 'Last 2 years'},
            edits: {id: 'Stats.activityType.edits', defaultMessage: 'Edits'},
            likes: {id: 'Stats.activityType.likes', defaultMessage: 'Likes'},
            views: {id: 'Stats.activityType.views', defaultMessage: 'Views'},

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
        const periodOptions = [{value: 'LAST_7_DAYS', text: this.context.intl.formatMessage(this.messages.last7Days)},
            {value: 'LAST_30_DAYS', text: this.context.intl.formatMessage(this.messages.last30Days)},
            {value: 'LAST_2_MONTHS', text: this.context.intl.formatMessage(this.messages.last2Months)},
            {value: 'LAST_6_MONTHS', text: this.context.intl.formatMessage(this.messages.last6Months)},
            {value: 'LAST_1_YEAR', text: this.context.intl.formatMessage(this.messages.last1Year)},
            {value: 'LAST_2_YEARS', text: this.context.intl.formatMessage(this.messages.last2Years)},
        ];

        const typeOptions = [{
            value: 'edit',
            text: this.context.intl.formatMessage(this.messages.edits)
        }, {
            value: 'like',
            text: this.context.intl.formatMessage(this.messages.likes)
        }, {
            value: 'view',
            text: this.context.intl.formatMessage(this.messages.views)
        }];

        let statsByTimeRows = this.props.userStats.statsByTime.map((stat, index) => {
            return (
              <Table.Row key={index}>
                  <Table.Cell>{new Date(stat.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{stat.count}</Table.Cell>
              </Table.Row>
            );
        });

        let statsByTagRows = this.props.userStats.statsByTag.map((stat, index) => {
            return (
              <Table.Row key={index}>
                  <Table.Cell>{stat.value}</Table.Cell>
                  <Table.Cell>{stat.count}</Table.Cell>
              </Table.Row>
            );
        });
        return (
          <Grid relaxed padded>
              {this.props.userStats.statsByTime && this.props.userStats.statsByTime.length > 0 &&
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <Message attached>
                          <h3>{this.context.intl.formatMessage(this.messages.activityTimelineTitle)}</h3>
                      </Message>
                      <Segment attached padded loading={this.props.userStats.statsByTimeLoading}>
                          <span>
                              <Grid>
                                  <Grid.Row columns={2}>
                                      <Grid.Column textAlign='left'>
                                          <Dropdown inline placeholder='Activity Type'
                                                    options={typeOptions}
                                                    value={this.props.userStats.activityType}
                                                    onChange={this.handleActivityTypeChange.bind(this)}/>
                                      </Grid.Column>
                                      <Grid.Column textAlign='right'>
                                          <Dropdown
                                            inline placeholder='Period' options={periodOptions}
                                            value={this.props.userStats.datePeriod}
                                            onChange={this.handleDatePeriodChange.bind(this)}/>
                                      </Grid.Column>
                                  </Grid.Row>
                                  <Grid.Row columns={1}>
                                      <Grid.Column aria-describedby='userStatsByDateTable' aria-label='Data table for graph' tabIndex='0' aria-hidden='true'>
                                          <ResponsiveContainer height={300}>
                                              <LineChart data={this.props.userStats.statsByTime}
                                                         margin={{top: 5, right: 30, left: 30, bottom: 5}}>
                                                  <YAxis type="number" width={10} allowDecimals={false} stroke='#767676'/>
                                                  <XAxis dataKey='date' name='Date'
                                                         type='category' stroke='#767676'
                                                         tickFormatter={(unixTime) => moment(unixTime).format('Y-M-D')}/>
                                                  <Tooltip
                                                    labelFormatter={(unixTime) => moment(unixTime).format('Y-M-D')}/>
                                                  <Line dataKey="count" dot={false} type="monotone"/>
                                              </LineChart>
                                          </ResponsiveContainer>
                                      </Grid.Column>
                                      <Grid.Column>
                                          <Table id='userStatsByDateTable' className="sr-only">
                                              <Table.Header>
                                                  <Table.Row>
                                                      <Table.HeaderCell>Date</Table.HeaderCell>
                                                      <Table.HeaderCell>Count</Table.HeaderCell>
                                                  </Table.Row>
                                              </Table.Header>
                                              <Table.Body>
                                                  {statsByTimeRows}
                                              </Table.Body>
                                          </Table>
                                      </Grid.Column>
                                  </Grid.Row>
                              </Grid>
                          </span>
                      </Segment>
                  </Grid.Column>
              </Grid.Row>}
              {this.props.userStats.statsByTag && this.props.userStats.statsByTag.length > 0 &&
              <Grid.Row centered columns={1}>
                  <Grid.Column>
                      <Message attached><h3>{this.context.intl.formatMessage(this.messages.tagCloudTitle)}</h3></Message>
                      <Segment aria-describedby='userStatsByTagTable' attached textAlign='center' padded='very'
                               loading={this.props.userStats.statsByTagLoading} aria-label='Data table for popular tags' tabIndex='0' aria-hidden='true'>
                          <TagCloud minSize={16} maxSize={40} tags={this.props.userStats.statsByTag} colorOptions={{luminosity: 'dark'}} />
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
          </Grid>
        );
    }
}

UserStats.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default UserStats;
