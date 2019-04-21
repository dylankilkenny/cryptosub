import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import React from 'react';
import moment from 'moment';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import TickCheckBox from './TickCheckBox';
import { DateRangePicker } from 'react-dates';

const GlobalChartHeader = ({
  startDate,
  endDate,
  handleDateChange,
  focusedInput,
  handleFocusChange,
  dates_limit,
  handleCheckBoxChange
}) => (
  <Card>
    <Card.Body>
      <Container>
        <Row>
          <Col sm="12" md="6">
            <DateRangePicker
              showClearDates={true}
              small={true}
              displayFormat="DD MMM  YY"
              isOutsideRange={day =>
                !moment(day).isBetween(
                  dates_limit.earliest,
                  dates_limit.closest
                )
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
          <Col sm="12" md="6">
            <TickCheckBox handle={handleCheckBoxChange} />
          </Col>
        </Row>
      </Container>
    </Card.Body>
  </Card>
);

export default GlobalChartHeader;
