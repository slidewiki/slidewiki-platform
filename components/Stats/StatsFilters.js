import React from 'react';
import {Dropdown, Grid, Message, Segment, Table} from 'semantic-ui-react';
import moment from 'moment';
import {defineMessages} from 'react-intl';
import PropTypes from 'prop-types';



class StatsFilters extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }

    getIntlMessages() {
        return defineMessages({
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

        return (
          <Grid>
              <Grid.Row columns={2}>
                  <Grid.Column textAlign='left'>
                      <Dropdown inline placeholder='Activity Type'
                                options={typeOptions}
                                value={this.props.activityType}
                                onChange={this.props.handleActivityTypeChange}/>
                  </Grid.Column>
                  <Grid.Column textAlign='right'>
                      <Dropdown
                        inline placeholder='Period' options={periodOptions}
                        value={this.props.datePeriod}
                        onChange={this.props.handleDatePeriodChange}/>
                  </Grid.Column>
              </Grid.Row>
          </Grid>
        );
    }
}

StatsFilters.contextTypes = {
    intl: PropTypes.object.isRequired
};

export default StatsFilters;
