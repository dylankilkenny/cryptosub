import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Label, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TableRow = props => (
  <Table.Row textAlign="center">
    <Table.Cell>{props.rank}</Table.Cell>
    <Table.Cell textAlign="left">
      <Link
        to={{
          pathname: `/${props.subreddit}`,
          state: { rank: props.rank }
        }}
      >
        r/
        {props.subreddit}
      </Link>
    </Table.Cell>
    <Table.Cell textAlign="left">
      <h5>{props.most_popular}</h5>
    </Table.Cell>
    <Table.Cell>
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
    </Table.Cell>
    <Table.Cell>
      <Label
        color={parseInt(props.tf_hr_change) < 0 ? 'red' : 'green'}
        horizontal
      >
        {parseInt(props.tf_hr_change)}%
      </Label>
    </Table.Cell>
    <Table.Cell>
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
    </Table.Cell>
    <Table.Cell>
      <Label
        color={parseInt(props.seven_day_change) < 0 ? 'red' : 'green'}
        horizontal
      >
        {parseInt(props.seven_day_change)}%
      </Label>
    </Table.Cell>
    <Table.Cell>
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
    </Table.Cell>
    <Table.Cell>
      <Label
        color={parseInt(props.thirty_day_change) < 0 ? 'red' : 'green'}
        horizontal
      >
        {parseInt(props.thirty_day_change)}%
      </Label>
    </Table.Cell>
  </Table.Row>
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
