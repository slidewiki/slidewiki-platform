import React from 'react';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Dropdown, Grid, Message, Segment} from 'semantic-ui-react';
import moment from 'moment';
import updateUserStatsPeriod from '../../../../actions/stats/updateUserStatsPeriod';
import updateUserStatsActivityType from '../../../../actions/stats/updateUserStatsActivityType';
import {TagCloud} from 'react-tagcloud';


import PropTypes from 'prop-types';

class UserStats extends React.Component {

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
        const periodOptions = [{value: 'LAST_7_DAYS', text: 'Last 7 days'},
            {value: 'LAST_30_DAYS', text: 'Last 30 days'},
            {value: 'LAST_2_MONTHS', text: 'Last 2 months'},
            {value: 'LAST_6_MONTHS', text: 'Last 6 months'},
            {value: 'LAST_1_YEAR', text: 'Last 1 year'},
            {value: 'LAST_2_YEARS', text: 'Last 2 years'},];

        const typeOptions = [{value: 'edit', text: 'Edits'}, {value: 'like', text: 'Likes'}, {
            value: 'view',
            text: 'Views'
        }];
        return (
          <Grid relaxed padded>
              {this.props.userStats.statsByTime && this.props.userStats.statsByTime.length > 0 &&
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <Message
                        attached
                        header='Activity Timeline'
                      />
                      <Segment attached padded>
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
                                      <ResponsiveContainer height={300}>
                                          <LineChart data={this.props.userStats.statsByTime}
                                                     margin={{top: 5, right: 30, left: 30, bottom: 5}}>
                                              <YAxis type="number" width={10} allowDecimals={false}/>
                                              <XAxis dataKey='date' name='Date'
                                                     type='category'
                                                     tickFormatter={(unixTime) => moment(unixTime).format('Y-M-D')}/>
                                              <Tooltip labelFormatter={(unixTime) => moment(unixTime).format('Y-M-D')}/>
                                              <Line dataKey="count" dot={false} type="monotone"/>
                                          </LineChart>
                                      </ResponsiveContainer>
                                  </Grid.Row>
                              </Grid>
                          </span>
                      </Segment>
                  </Grid.Column>
              </Grid.Row>}
              {this.props.userStats.statsByTag && this.props.userStats.statsByTag.length > 0 &&
              <Grid.Row centered columns={1}>
                  <Grid.Column>
                      <Message
                        attached
                        header='Popular Tags'
                      />
                      <Segment attached textAlign='center' padded='very'>
                          <TagCloud minSize={16} maxSize={40} tags={this.props.userStats.statsByTag}/>
                      </Segment>
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
