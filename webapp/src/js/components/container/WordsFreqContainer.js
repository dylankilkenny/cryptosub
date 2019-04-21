import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
import { Segment, Header, Grid, Button } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

class WordsFreqContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alltime: true,
      pickdate: false,
      focused: null,
      data: this.props.WordCount
    };
    this.handleButton = this.handleButton.bind(this);
    this.storeData = this.storeData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDayObject = this.handleDayObject.bind(this);
  }
  componentDidMount() {
    fetch(API_URL + 'WordCountByDay', {
      method: 'POST',
      body: this.props.payload,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.storeData(data[0].word_freq_by_day);
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
    const word_freq_array_day = orderBy(day[0].counts, ['n'], ['desc']);
    // const day_array = this.handleDayObject(word_freq_obj);
    this.setState({
      date: latest_date,
      day: word_freq_array_day.slice(0, 20),
      wordsbyday: data
    });
  };

  handleDayObject = obj => {
    let day_array = [];
    for (var word in obj) {
      if (obj.hasOwnProperty(word)) {
        day_array.push({
          word: word,
          n: obj[word]
        });
      }
    }
    const day_array_sorted = orderBy(day_array, ['n'], ['desc']);
    return day_array_sorted;
  };

  handleButton = (event, data) => {
    console.log(this.state.day);
    console.log(this.props.WordCount);
    if (!data.active) {
      this.setState({
        alltime: this.state.pickdate,
        pickdate: this.state.alltime
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
      day: day_array.slice(0, 20),
      date: moment_date
    });
  };

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column verticalAlign="middle" textAlign="right" width={8}>
              <Button.Group>
                <Button
                  onClick={this.handleButton}
                  color={this.state.alltime ? 'yellow' : null}
                  active={this.state.alltime}
                >
                  {' '}
                  All Time{' '}
                </Button>
                <Button.Or />
                <Button
                  onClick={this.handleButton}
                  color={this.state.pickdate ? 'yellow' : null}
                  active={this.state.pickdate}
                >
                  {' '}
                  Pick Date{' '}
                </Button>
              </Button.Group>
            </Grid.Column>
            <Grid.Column verticalAlign="middle" textAlign="left" width={8}>
              <SingleDatePicker
                disabled={this.state.alltime}
                date={this.state.date}
                displayFormat="DD MMM  YY"
                isOutsideRange={() => false}
                onDateChange={date => this.handleDateChange(date)}
                focused={this.state.focused}
                onFocusChange={({ focused }) => this.setState({ focused })}
                id="your_unique_id"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={2} />
            <Grid.Column textAlign="center" width={12}>
              {this.state.alltime ? (
                <ResponsiveContainer width="99%" height={400}>
                  <BarChart
                    layout="vertical"
                    data={this.props.word_freq}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis interval={0} type="category" dataKey="word" />
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
                <ResponsiveContainer width="99%" height={400}>
                  <BarChart
                    layout="vertical"
                    data={this.state.day}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis interval={0} type="category" dataKey="word" />
                    <XAxis type="number" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      barSize={15}
                      name="Frequency"
                      dataKey="n"
                      stackId="a"
                      fill="#8884d8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Grid.Column>
            <Grid.Column width={2} />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

WordsFreqContainer.propTypes = {
  WordCount: PropTypes.array.isRequired,
  payload: PropTypes.string.isRequired
};

export default WordsFreqContainer;
