import React from 'react';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Dropdown, Grid, Message, Segment, Table} from 'semantic-ui-react';
import moment from 'moment';
import {defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import StatsFilters from './StatsFilters';


class ActivityTimeline extends React.Component {

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
        });
    }

    render() {
        let activityTimelineTableRows = this.props.statsByTime.map((stat, index) => {
            return (
              <Table.Row key={index}>
                  <Table.Cell>{new Date(stat.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{stat.count}</Table.Cell>
              </Table.Row>
            );
        });

        return (
          <div>
              <Message attached>
                  <h2>{this.context.intl.formatMessage(this.messages.activityTimelineTitle)}</h2>
              </Message>
              <Segment attached padded loading={this.props.loading}>
                  <span>
                      <StatsFilters activityType={this.props.activityType}
                                    datePeriod={this.props.datePeriod}
                                    handleActivityTypeChange={this.props.handleActivityTypeChange}
                                    handleDatePeriodChange={this.props.handleDatePeriodChange} />
                      <Grid>
                          <Grid.Row columns={1}>
                              <Grid.Column aria-describedby='activityTimelineTable'
                                           aria-label='Data table for graph' tabIndex='0' aria-hidden='true'>
                                  <ResponsiveContainer height={300}>
                                      <LineChart data={this.props.statsByTime}
                                                 margin={{top: 5, right: 30, left: 30, bottom: 5}}>
                                          <YAxis type="number" width={10} allowDecimals={false}
                                                 stroke='#767676'/>
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
                                  <Table id='activityTimelineTable' className="sr-only">
                                      <Table.Header>
                                          <Table.Row>
                                              <Table.HeaderCell>Date</Table.HeaderCell>
                                              <Table.HeaderCell>Count</Table.HeaderCell>
                                          </Table.Row>
                                      </Table.Header>
                                      <Table.Body>
                                          {activityTimelineTableRows}
                                      </Table.Body>
                                  </Table>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                  </span>
              </Segment>
          </div>
        );
    }
}

ActivityTimeline.contextTypes = {
    intl: PropTypes.object.isRequired
};

export default ActivityTimeline;
