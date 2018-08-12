import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import sma from "sma";

import moment from "moment";
import _ from "lodash";
import { Segment, Grid, Header } from "semantic-ui-react";

import ChartHeader from "../presentational/ChartHeader";
import Chart from "../presentational/Chart";

class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tick: 24,
      activityChecked: true
    };
    this.storeData = this.storeData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.activityMovingAverage = this.activityMovingAverage.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
  }
  componentDidMount() {
    fetch(API_URL + "CommentsPostsByDay", {
      method: "POST",
      body: this.props.payload,
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        return response.json();
      })
      .then(json => this.storeData(json));
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  activityMovingAverage = data => {
    const n = data.map(n => n.n);
    const date = data.map(date => date.Date);
    const MonthDay = data.map(date => date.MonthDay);
    const sma_activity = sma(n, this.state.tick);
    var date_idx = this.state.tick;
    var arr = [];
    for (var i = 0; i < sma_activity.length; i++) {
      arr.push({
        Date: date[date_idx],
        MonthDay: MonthDay[date_idx],
        sma: parseInt(sma_activity[i])
      });
      date_idx++;
    }
    return arr;
  };

  storeData = data => {
    const closest_date = moment(data[data.length - 1].Date),
      furthest_date = moment(data[data.length - 1].Date).subtract(7, "days");
    const sma_activity = this.activityMovingAverage(data);
    this.setState(
      {
        startDate: furthest_date,
        endDate: closest_date,
        CommentsPostsByDay: data,
        sma_activity: sma_activity,
        dates_limit: {
          earliest: moment(data[0].Date),
          closest: moment(data[data.length - 1].Date)
        }
      },
      () => {
        this.handleDateChange(furthest_date, closest_date);
      }
    );
  };

  handleCheckBoxChange = data => {
    this.setState({
      activityChecked: data.checked
    });
    console.log(data);
  };

  handleDateChange = (startDate, endDate) => {
    let filtered = _.filter(this.state.CommentsPostsByDay, function(o) {
      return moment(o.Date).isBetween(startDate, endDate);
    });
    let filteredActivitySMA = _.filter(this.state.sma_activity, function(o) {
      return moment(o.Date).isBetween(startDate, endDate);
    });

    this.setState({
      filteredCommPosts: filtered,
      filteredActivitySMA: filteredActivitySMA,
      startDate: startDate,
      endDate: endDate
    });
  };

  handleFocusChange = focusedInput => {
    this.setState({
      focusedInput: focusedInput
    });
  };

  render() {
    return (
      <div>
        <ChartHeader
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          handleDateChange={this.handleDateChange}
          handleCheckBoxChange={this.handleCheckBoxChange}
          focusedInput={this.state.focusedInput}
          handleFocusChange={this.handleFocusChange}
          dates_limit={this.state.dates_limit}
          activityChecked={this.state.activityChecked}
        />
        {this.state.activityChecked != true ? (
          <Chart
            activityChecked={this.state.activityChecked}
            data={this.state.filteredCommPosts}
          />
        ) : (
          <Chart
            activityChecked={this.state.activityChecked}
            data={this.state.filteredActivitySMA}
          />
        )}
      </div>
    );
  }
}

ChartContainer.propTypes = {
  CommentsPostsByDay: PropTypes.array.isRequired,
  payload: PropTypes.string.isRequired
};

export default ChartContainer;
