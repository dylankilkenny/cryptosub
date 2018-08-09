import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import moment from "moment";
import _ from "lodash";
import { Segment, Grid, Header } from "semantic-ui-react";

import ChartHeader from "../presentational/ChartHeader";
import Chart from "../presentational/Chart";

class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.storeData = this.storeData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
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

  storeData = data => {
    const closest_date = moment(data[data.length - 1].Date);
    const furthest_date = moment(data[data.length - 1].Date).subtract(
      7,
      "days"
    );
    this.setState(
      {
        startDate: furthest_date,
        endDate: closest_date,
        CommentsPostsByDay: data,
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

  handleDateChange = (startDate, endDate) => {
    let filtered = _.filter(this.state.CommentsPostsByDay, function(o) {
      return moment(o.Date).isBetween(startDate, endDate);
    });
    this.setState({
      filteredCommPosts: filtered,
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
          focusedInput={this.state.focusedInput}
          handleFocusChange={this.handleFocusChange}
          dates_limit={this.state.dates_limit}
        />
        <Chart filteredCommPosts={this.state.filteredCommPosts} />
      </div>
    );
  }
}

ChartContainer.propTypes = {
  CommentsPostsByDay: PropTypes.array.isRequired,
  payload: PropTypes.string.isRequired
};

export default ChartContainer;
