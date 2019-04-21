import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import orderBy from 'lodash/orderBy';
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
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

class BigramsFreqContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: 'alltime',
      focused: null,
      data: this.props.BigramCount
    };
    this.handleButton = this.handleButton.bind(this);
    this.storeData = this.storeData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDayObject = this.handleDayObject.bind(this);
  }
  componentDidMount() {
    fetch(API_URL + 'BigramByDay', {
      method: 'POST',
      body: this.props.payload,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.storeData(data[0].bigram_freq_by_day);
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
    const bigram_freq_array_day = orderBy(day[0].counts, ['n'], ['desc']);

    this.setState({
      date: latest_date,
      day: bigram_freq_array_day.slice(0, 15),
      wordsbyday: data
    });
  };

  handleDayObject = obj => {
    let day_array = [];
    for (var word in obj) {
      if (obj.hasOwnProperty(word)) {
        day_array.push({
          bigram: word,
          n: obj[word]
        });
      }
    }
    const day_array_sorted = orderBy(day_array, ['n'], ['desc']);
    return day_array_sorted;
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
    const wordsbyday = this.state.wordsbyday;
    const day = wordsbyday.filter(day => day.Date == moment_format);
    const word_freq_obj = day[0].counts;
    const day_array = this.handleDayObject(word_freq_obj);
    this.setState({
      day: day_array.slice(0, 15),
      date: moment_date
    });
  };

  render() {
    return (
      <div>
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
              {this.state.alltime == 'alltime' ? (
                <ResponsiveContainer width="99%" height={500}>
                  <BarChart
                    layout="vertical"
                    data={this.props.bigram_freq}
                    margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis interval={0} type="category" dataKey="bigram" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      name="# Comment"
                      dataKey="n_comment"
                      stackId="a"
                      fill="#8884d8"
                    />
                    <Bar
                      name="# Post"
                      dataKey="n_post"
                      stackId="a"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="99%" height={500}>
                  <BarChart
                    layout="vertical"
                    data={this.state.day}
                    margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis
                      padding={{ left: 20 }}
                      interval={0}
                      type="category"
                      dataKey="bigram"
                    />
                    <XAxis type="number" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      name="Frequency"
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
      </div>
    );
  }
}

BigramsFreqContainer.propTypes = {
  BigramCount: PropTypes.array.isRequired,
  payload: PropTypes.string.isRequired
};

export default BigramsFreqContainer;
