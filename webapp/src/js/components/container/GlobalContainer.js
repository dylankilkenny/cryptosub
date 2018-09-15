import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import moment from 'moment';

import GlobalChart from '../presentational/GlobalChart';
import MainContentGrid from '../presentational/MainContentGrid';
import GlobalChartHeader from '../presentational/GlobalChartHeader';

class GlobalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: ['btc', 'Bitcoin', 'CryptoCurrency'],
      colors: ['#ffa700', '#0057e7', '#008744', '	#FF0000', '#000000'],
      tick: 7,
      datakey: '_sma',
      sma_checked: true,
      selectionChanged: false
    };
    this.storeData = this.storeData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubredditSelection = this.handleSubredditSelection.bind(this);
    this.fetchDatahandleBlur = this.handleBlur.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleTickSelection = this.handleTickSelection.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  fetchData = () => {
    const endpoint = 'Global';
    fetch(API_URL + endpoint, {
      method: 'POST',
      body: JSON.stringify({
        subreddits: this.state.selected,
        tick: this.state.tick
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json();
      })
      .then(data => this.storeData(data));
  };

  storeData = data => {
    const activity = data.activity;
    const endDate = moment(activity[activity.length - 1].date);
    const startDate = moment(activity[activity.length - 1].date).subtract(
      60,
      'days'
    );
    this.setState(
      {
        startDate: startDate,
        endDate: endDate,
        data: activity,
        selectionChanged: false,
        subredditList: data.subredditList,
        dates_limit: {
          earliest: moment(activity[0].date),
          closest: moment(activity[activity.length - 1].date)
        }
      },
      () => {
        this.handleDateChange(startDate, endDate);
      }
    );
  };

  handleFocusChange = focusedInput => {
    this.setState({
      focusedInput: focusedInput
    });
  };

  handleDateChange = (startDate, endDate) => {
    let filtered = _.filter(this.state.data, function(o) {
      return moment(o.date).isBetween(startDate, endDate);
    });
    this.setState({
      filteredData: filtered,
      startDate: startDate,
      endDate: endDate
    });
  };

  handleCheckBoxChange = data => {
    this.setState({
      sma_checked: data.checked,
      datakey: data.checked ? '_sma' : ''
    });
  };

  handleSubredditSelection = (e, data) => {
    const selectionChanged = this.state.selected == data.value ? false : true;
    this.setState(
      {
        selected: data.value,
        selectionChanged: selectionChanged
      },
      () => this.fetchData()
    );
  };

  handleTickSelection = (e, data) => {
    this.setState(
      {
        tick: data.value
      },
      () => this.fetchData()
    );
  };

  handleBlur = (e, data) => {
    if (this.state.selectionChanged) {
      this.fetchData();
    }
  };

  render() {
    return (
      <div>
        <MainContentGrid width={14}>
          <div>
            <GlobalChartHeader
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              handleDateChange={this.handleDateChange}
              handleCheckBoxChange={this.handleCheckBoxChange}
              focusedInput={this.state.focusedInput}
              handleFocusChange={this.handleFocusChange}
              dates_limit={this.state.dates_limit}
              sma_checked={this.state.sma_checked}
              subredditList={this.state.subredditList}
              selected={this.state.selected}
              handleSubredditSelection={this.handleSubredditSelection}
              handleBlur={this.handleBlur}
              handleTickSelection={this.handleTickSelection}
            />
            <GlobalChart
              data={this.state.filteredData}
              selected={this.state.selected}
              colors={this.state.colors}
              datakey={this.state.datakey}
            />
          </div>
        </MainContentGrid>
      </div>
    );
  }
}

export default GlobalContainer;
