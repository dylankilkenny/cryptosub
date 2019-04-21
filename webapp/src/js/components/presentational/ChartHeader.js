import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { DateRangePicker } from 'react-dates';

function CheckBox({ handle }) {
  const useCheckbox = (val = true) => {
    const [value, setValue] = useState(val);
    let func = event => {
      setValue(event.target.checked);
      handle(event.target);
    };
    return [value, func];
  };
  const [checked, setChecked] = useCheckbox();
  return (
    <div>
      <input type="checkbox" checked={checked} onChange={setChecked} /> Simple
      Moving Average
    </div>
  );
}

const ChartHeader = ({
  startDate,
  endDate,
  handleDateChange,
  focusedInput,
  handleFocusChange,
  dates_limit,
  handleCheckBoxChange,
  activityChecked
}) => (
  <Container>
    <Row>
      <Col sm="12" md="8">
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
      </Col>
      <Col sm="12" md="4">
        <CheckBox handle={handleCheckBoxChange} />
      </Col>
    </Row>
  </Container>
);

ChartHeader.propTypes = {
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleFocusChange: PropTypes.func.isRequired,
  focusedInput: PropTypes.string
};

export default ChartHeader;
