import React from 'react';
import {Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {Dropdown} from 'semantic-ui-react';
import moment from 'moment';
import updateUserStatsPeriod from '../../../../actions/stats/updateUserStatsPeriod';
import {defineMessages, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

class UserStats extends React.Component {

    handleDatePeriodChange(event, {value}) {
        this.context.executeAction(updateUserStatsPeriod, {
            datePeriod: value
        });
    }

    render() {
        const periodOptions = [{value: 'LAST_7_DAYS', text: 'Last 7 days'},
            {value: 'LAST_30_DAYS', text: 'Last 30 days'},
            {value: 'LAST_2_MONTHS', text: 'Last 2 months'},
            {value: 'LAST_6_MONTHS', text: 'Last 6 months'},
            {value: 'LAST_1_YEAR', text: 'Last 1 year'},
            {value: 'LAST_2_YEARS', text: 'Last 2 years'},];
        return (<div>
              <Dropdown placeholder='Date Period' options={periodOptions} value={this.props.userStats.datePeriod} onChange={this.handleDatePeriodChange.bind(this)} />
              {this.props.userStats.activitiesByTime && this.props.userStats.activitiesByTime.length > 0 && <div className="ui segments">
                  <LineChart width={600} height={300} data={this.props.userStats.activitiesByTime}
                             margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                      <YAxis type="number"/>
                      <XAxis dataKey='date'
                             name='Date'
                             type='category'
                             tickFormatter={(unixTime) => moment(unixTime).format('Y-M-D')} /*domain={['dataMin', 'dataMax']} scale='time'  interval='preserveStartEnd'*/
                      />
                      <Tooltip labelFormatter={(unixTime) => moment(unixTime).format('Y-M-D')}/>
                      <Line dataKey="value" dot={false} type="monotone"/>
                  </LineChart>
              </div>}
          </div>
        );
    }
}

UserStats.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default UserStats;
