import React from 'react';
import Table from '../presentational/Table';
import MainContentGrid from '../presentational/MainContentGrid';
import orderBy from 'lodash/orderBy';
// import Pagination from '../presentational/Pagination';
// import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

class TableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subs: [],
      SortedColumn: 'Activity (30d)',
      SortDirection: 'descending',
      page_number: 1,
      page_size: 20,
      total_size: null
    };
    this.storeSubreddits = this.storeSubreddits.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  fetchData = () => {
    const payload = {
      page_size: this.state.page_size,
      page_number: this.state.page_number
    };
    const endpoint = 'AllSubreddits';
    fetch(API_URL + endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.storeSubreddits(data);
      })
      .catch(error => console.log(error));
  };

  handlePageClick = event => {
    this.setState(
      {
        page_number: event.activePage
      },
      function() {
        this.fetchData();
      }
    );
  };

  handleSort = (clickedColumn, title) => () => {
    const { SortedColumn, subs, SortDirection } = this.state;
    if (SortedColumn !== title) {
      const SortedSubs = orderBy(subs, [clickedColumn], ['desc']);
      this.setState({
        SortedColumn: title,
        subs: SortedSubs,
        SortDirection: 'descending'
      });
      return;
    }
    this.setState({
      subs: subs.reverse(),
      SortDirection: SortDirection === 'ascending' ? 'descending' : 'ascending'
    });
  };

  storeSubreddits = response => {
    let data = response.data;
    var i = 0;
    var subs = data.map(d => {
      i++;
      return {
        key: i,
        rank: d.rank,
        subreddit: d.id,
        most_popular: d.most_popular,
        tf_hr_total: d.one_day_total,
        tf_hr_change: d.one_day_change,
        seven_day_total: d.seven_day_total,
        seven_day_change: d.seven_day_change,
        thirty_day_total: d.thirty_day_total,
        thirty_day_change: d.thirty_day_change
      };
    });
    subs = orderBy(subs, ['thirty_day_total'], ['desc']);
    this.setState({
      subs: subs,
      page_number: response.page_number,
      total_size: response.total_size,
      page_size: response.page_size
    });
  };

  render() {
    return (
      <MainContentGrid>
        <div>
          <Table
            subreddits={this.state.subs}
            column={this.state.SortedColumn}
            direction={this.state.SortDirection}
            handleSort={this.handleSort}
          />
          {/* <Container textAlign="right">
            {console.log(this.state.total_size)}
            {console.log(this.state.page_size)}

            <Pagination
              activePage={this.state.page_number}
              itemsCountPerPage={this.state.page_size}
              totalItemsCount={this.state.total_size}
              pageRangeDisplayed={3}
              onChange={this.handlePageClick}
            />
          </Container> */}
        </div>
      </MainContentGrid>
    );
  }
}
export default TableContainer;
