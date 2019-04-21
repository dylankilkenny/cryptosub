import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import TableRow from './TableRow';

const TableCoin = props => (
  <Table responsive>
    <thead>
      <tr>
        <th onClick={props.handleSort('rank', '#')}>#</th>
        <th onClick={props.handleSort('subreddit', 'Subreddit')}>Subreddit</th>
        <th onClick={props.handleSort('most_popular', 'Most Popular Coin')}>
          Most Popular Coin
        </th>
        <th onClick={props.handleSort('tf_hr_total', 'Activity (24hr)')}>
          Activity (24hr)
        </th>
        <th onClick={props.handleSort('tf_hr_change', 'Change (24hr)')}>
          Change (24hr)
        </th>
        <th onClick={props.handleSort('seven_day_total', 'Activity (7d)')}>
          Activity (7d)
        </th>
        <th onClick={props.handleSort('seven_day_change', 'Change (7d)')}>
          Change (7d)
        </th>
        <th onClick={props.handleSort('thirty_day_total', 'Activity (30d)')}>
          Activity (30d)
        </th>
        <th onClick={props.handleSort('thirty_day_change', 'Change (30d)')}>
          Change (30d)
        </th>
      </tr>
    </thead>
    <tbody>
      {props.subreddits.map((sub, index) => (
        <TableRow
          key={index}
          rank={sub.rank}
          most_popular={sub.most_popular}
          subreddit={sub.subreddit}
          tf_hr_total={sub.tf_hr_total}
          tf_hr_change={sub.tf_hr_change}
          seven_day_total={sub.seven_day_total}
          seven_day_change={sub.seven_day_change}
          thirty_day_total={sub.thirty_day_total}
          thirty_day_change={sub.thirty_day_change}
        />
      ))}
    </tbody>
  </Table>
);

TableCoin.propTypes = {
  subreddits: PropTypes.array.isRequired,
  column: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  handleSort: PropTypes.func.isRequired
};

export default TableCoin;
