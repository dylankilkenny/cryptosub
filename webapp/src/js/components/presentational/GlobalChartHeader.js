import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Grid, Checkbox, Dropdown } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';
const tickOptions = [
  { key: 1, text: '7 Days', value: 7 },
  { key: 2, text: '14 Days', value: 14 },
  { key: 3, text: '30 Days', value: 30 }
];

const GlobalChartHeader = ({
  startDate,
  endDate,
  handleDateChange,
  focusedInput,
  handleFocusChange,
  dates_limit,
  handleCheckBoxChange,
  sma_checked,
  subredditList,
  selected,
  handleSubredditSelection,
  handleBlur,
  handleTickSelection
}) => (
  <Grid verticalAlign="middle">
    <Grid.Row>
      <Grid.Column width={6}>
        <Dropdown
          placeholder="Select Subredits"
          fluid
          multiple
          search
          selection
          defaultValue={selected}
          options={subredditList}
          onChange={handleSubredditSelection}
          onBlur={handleBlur}
        />
      </Grid.Column>
      <Grid.Column width={5} textAlign="center">
        <DateRangePicker
          showClearDates={true}
          small={true}
          displayFormat="DD MMM  YY"
          isOutsideRange={day =>
            !moment(day).isBetween(dates_limit.earliest, dates_limit.closest)
          }
          startDate={startDate}
          startDateId="startDate"
          endDate={endDate}
          endDateId="endDate"
          onDatesChange={({ startDate, endDate }) => {
            handleDateChange(startDate, endDate);
          }}
          focusedInput={focusedInput}
          onFocusChange={focusedInput => {
            handleFocusChange(focusedInput);
          }}
        />
      </Grid.Column>
      <Grid.Column width={2} textAlign="center">
        <Dropdown
          onChange={handleTickSelection}
          text="SMA Tick"
          options={tickOptions}
          simple
          item
        />
      </Grid.Column>
      <Grid.Column width={3} textAlign="center">
        <Checkbox
          checked={sma_checked}
          onClick={(data, event) => {
            handleCheckBoxChange(event);
          }}
          label="Activity SMA"
          toggle
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default GlobalChartHeader;
