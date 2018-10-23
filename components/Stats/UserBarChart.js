import React from 'react';
import {BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Dropdown, Grid, Message, Segment, Table} from 'semantic-ui-react';
import StatsFilters from './StatsFilters';


class UserBarChart extends React.Component {

    render() {
        let tableRows = this.props.data.map((stat, index) => {
            return (
              <Table.Row key={index}>
                  <Table.Cell>{stat.username}</Table.Cell>
                  <Table.Cell>{stat.count}</Table.Cell>
              </Table.Row>
            );
        });

        return (
          <div>
              <Message attached>
                  <h3>{this.props.title}</h3>
              </Message>
              <Segment attached padded loading={this.props.loading}>
                  <span>
                      <StatsFilters activityType={this.props.activityType}
                                    datePeriod={this.props.datePeriod}
                                    handleActivityTypeChange={this.props.handleActivityTypeChange}
                                    handleDatePeriodChange={this.props.handleDatePeriodChange} />
                      <Grid>
                          <Grid.Row columns={1}>
                              <Grid.Column aria-describedby='userBarChartTable'
                                           aria-label='Data table for graph' tabIndex='0' aria-hidden='true'>
                                  <ResponsiveContainer height={300}>
                                      <BarChart width={600} height={300} data={this.props.data}
                                                margin={{top: 5, right: 30, left: 20, bottom: 5}} maxBarSize={70}>
                                          <XAxis dataKey="username"/>
                                          <YAxis/>
                                          <Bar dataKey="count" fill="#8884d8" />
                                      </BarChart>
                                  </ResponsiveContainer>
                              </Grid.Column>
                              <Grid.Column>
                                  <Table id='userBarChartTable' className="sr-only">
                                      <Table.Header>
                                          <Table.Row>
                                              <Table.HeaderCell>User</Table.HeaderCell>
                                              <Table.HeaderCell>Count</Table.HeaderCell>
                                          </Table.Row>
                                      </Table.Header>
                                      <Table.Body>
                                          {tableRows}
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



export default UserBarChart;
