import React from 'react';
import moment from 'moment';
import GlobalChart from '../presentational/GlobalChart';
import MainContentGrid from '../presentational/MainContentGrid';
import CompareChartHeader from '../presentational/CompareChartHeader';
import CompareChartSelect from '../presentational/CompareChartSelect';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import filter from 'lodash/filter';

class GlobalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: ['btc', 'Bitcoin', 'CryptoCurrency'],
      colors: ['#ffa700', '#0057e7', '#008744', '	#FF0000', '#000000'],
      datakey: '_sma'
    };
    this.storeData = this.storeData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubredditSelection = this.handleSubredditSelection.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleSubredditRemoval = this.handleSubredditRemoval.bind(this);
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
        tick: 7
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
      120,
      'days'
    );
    this.setState(
      {
        startDate: startDate,
        endDate: endDate,
        data: activity,
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
    let filtered = filter(this.state.data, function(o) {
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
      datakey: data.checked ? '_sma' : ''
    });
  };

  handleSubredditSelection = event => {
    const value = event.target.value;
    if (this.state.selected.indexOf(value) < 1) {
      const updatedSelections = [...this.state.selected, value];
      this.setState(
        {
          selected: updatedSelections
        },
        () => this.fetchData()
      );
    }
  };

  handleSubredditRemoval = subreddit => {
    let subs = this.state.selected;
    const position = subs.indexOf(subreddit);
    subs.splice(position, 1);

    this.setState(
      {
        selected: subs
      },
      () => this.fetchData()
    );
  };

  render() {
    if (!this.state.subredditList) {
      return <div />;
    }
    return (
      <div>
        <MainContentGrid width={14}>
          <Container>
            <Row className="justify-content-md-center">
              <Col sm="12" md="3">
                <CompareChartSelect
                  selected={this.state.selected}
                  subredditList={this.state.subredditList}
                  handleChange={this.handleSubredditSelection}
                  handleSubredditRemoval={this.handleSubredditRemoval}
                />
              </Col>
              <Col sm="12" md="9">
                <CompareChartHeader
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  handleDateChange={this.handleDateChange}
                  handleCheckBoxChange={this.handleCheckBoxChange}
                  focusedInput={this.state.focusedInput}
                  handleFocusChange={this.handleFocusChange}
                  dates_limit={this.state.dates_limit}
                />
                <GlobalChart
                  data={this.state.filteredData}
                  selected={this.state.selected}
                  colors={this.state.colors}
                  datakey={this.state.datakey}
                />
              </Col>
            </Row>
          </Container>
        </MainContentGrid>
      </div>
    );
  }
}

export default GlobalContainer;
