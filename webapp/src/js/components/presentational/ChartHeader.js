import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { Segment, Grid, Header } from "semantic-ui-react";
import { DateRangePicker } from "react-dates";

const ChartHeader = ({
  startDate,
  endDate,
  handleDateChange,
  focusedInput,
  handleFocusChange,
  dates_limit
}) => (
  <Grid verticalAlign="middle" columns="equal">
    <Grid.Row>
      <Grid.Column />
      <Grid.Column textAlign="center">
        {console.log(dates_limit.earliest)}
        {console.log(dates_limit.closest)}
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
    </Grid.Row>
  </Grid>
);

ChartHeader.propTypes = {
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleFocusChange: PropTypes.func.isRequired,
  focusedInput: PropTypes.string
};

export default ChartHeader;
