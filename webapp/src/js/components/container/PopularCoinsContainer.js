import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import {
  ResponsiveContainer,
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar
} from 'recharts';

class PopularCoinsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: 'alltime',
      focused: null
    };
    this.handleButton = this.handleButton.bind(this);
    this.storeData = this.storeData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    // this.handleDayObject = this.handleDayObject.bind(this);
  }

  componentDidMount() {
    fetch(API_URL + 'CurrencyMentionsByDay', {
      method: 'POST',
      body: this.props.payload,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.storeData(data);
      })
      .catch(error => console.log(error));
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  storeData = data => {
    const latest_date = moment(data[data.length - 1].Date);
    const moment_date = new moment(latest_date).format('YYYY-MM-DD');
    const day = data.filter(day => day.Date == moment_date);
    const pop_coins_obj = day[0].counts;
    const pop_coins_sorted = orderBy(pop_coins_obj, ['n'], ['desc']);

    this.setState({
      date: latest_date,
      day: pop_coins_sorted.slice(0, 10),
      popularcoins: data
    });
  };

  handleButton = (value, event) => {
    if (value != this.state.activeButton) {
      this.setState({
        activeButton: value
      });
    }
  };

  handleDateChange = date => {
    const moment_date = moment(date);
    const moment_format = moment_date.format('YYYY-MM-DD');
    const popularcoins = this.state.popularcoins;
    const day = popularcoins.filter(day => day.Date == moment_format);
    const pop_coins_obj = day[0].counts;
    const pop_coins_sorted = orderBy(pop_coins_obj, ['n'], ['desc']);
    this.setState({
      day: pop_coins_sorted.slice(0, 10),
      date: moment_date
    });
  };

  render() {
    if (!this.state.popularcoins) {
      return <div />;
    }
    return (
      <Container>
        <Row>
          <Col>
            <ToggleButtonGroup
              name="period"
              value={this.state.activeButton}
              onChange={this.handleButton}
            >
              <ToggleButton value="alltime">All Time</ToggleButton>
              <ToggleButton value="pickdate">Pick Date</ToggleButton>
            </ToggleButtonGroup>
          </Col>
          <Col>
            <SingleDatePicker
              disabled={this.state.activeButton == 'alltime'}
              date={this.state.date}
              displayFormat="DD MMM  YY"
              isOutsideRange={() => false}
              onDateChange={date => this.handleDateChange(date)}
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              id="your_unique_id"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.activeButton == 'alltime' ? (
              <ResponsiveContainer width="99%" height={400}>
                <BarChart
                  data={this.props.CurrencyMentions}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Symbol" angle={7} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    name="Name"
                    dataKey="Mentions_Name"
                    stackId="a"
                    fill="#8884d8"
                  />
                  <Bar
                    name="Symbol"
                    dataKey="Mentions_Sym"
                    stackId="a"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="99%" height={400}>
                <BarChart
                  data={this.state.day}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Symbol" angle={7} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    name="# Mentions"
                    dataKey="n"
                    stackId="a"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

PopularCoinsContainer.propTypes = {
  CurrencyMentions: PropTypes.array.isRequired,
  payload: PropTypes.string.isRequired
};

export default PopularCoinsContainer;
