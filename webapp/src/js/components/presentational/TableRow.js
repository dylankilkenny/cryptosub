import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';

const TableRow = props => (
  <tr>
    <td>{props.rank}</td>
    <td>
      <Link
        to={{
          pathname: `/${props.subreddit}`,
          state: { rank: props.rank }
        }}
      >
        r/
        {props.subreddit}
      </Link>
    </td>
    <td>
      <h6>{props.most_popular}</h6>
    </td>
    <td>
      <Link
        to={{
          pathname: `/${props.subreddit}`,
          state: { rank: props.rank }
        }}
      >
        <NumberFormat
          value={props.tf_hr_total}
          thousandSeparator={true}
          displayType={'text'}
        />
      </Link>
    </td>
    <td>
      <h5>
        <Badge
          variant={parseInt(props.tf_hr_change) < 0 ? 'danger' : 'success'}
        >
          {parseInt(props.tf_hr_change)}%
        </Badge>
      </h5>
    </td>
    <td>
      <Link
        to={{
          pathname: `/${props.subreddit}`,
          state: { rank: props.rank }
        }}
      >
        <NumberFormat
          value={props.seven_day_total}
          thousandSeparator={true}
          displayType={'text'}
        />
      </Link>
    </td>
    <td>
      <h5>
        <Badge
          variant={parseInt(props.seven_day_change) < 0 ? 'danger' : 'success'}
        >
          {parseInt(props.seven_day_change)}%
        </Badge>
      </h5>
    </td>
    <td>
      <Link
        to={{
          pathname: `/${props.subreddit}`,
          state: { rank: props.rank }
        }}
      >
        <NumberFormat
          value={props.thirty_day_total}
          thousandSeparator={true}
          displayType={'text'}
        />
      </Link>
    </td>
    <td>
      <h5>
        <Badge
          variant={parseInt(props.thirty_day_change) < 0 ? 'danger' : 'success'}
        >
          {parseInt(props.thirty_day_change)}%
        </Badge>
      </h5>
    </td>
  </tr>
);

TableRow.propTypes = {
  most_popular: PropTypes.string.isRequired,
  subreddit: PropTypes.string.isRequired,
  tf_hr_total: PropTypes.number.isRequired,
  tf_hr_change: PropTypes.number.isRequired,
  seven_day_total: PropTypes.number.isRequired,
  seven_day_change: PropTypes.number.isRequired,
  thirty_day_total: PropTypes.number.isRequired,
  thirty_day_change: PropTypes.number.isRequired
};

export default TableRow;
