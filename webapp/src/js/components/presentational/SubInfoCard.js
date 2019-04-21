import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import NumberFormat from 'react-number-format';

const SubInfoCard = props => (
  <Table striped bordered hover>
    <tbody>
      <tr>
        <td>Total Posts</td>
        <td>
          <NumberFormat
            value={props.Subreddit.no_posts}
            thousandSeparator={true}
            displayType={'text'}
          />
        </td>
        <td>Total Comments</td>
        <td>
          <NumberFormat
            value={props.Subreddit.no_comments}
            thousandSeparator={true}
            displayType={'text'}
          />
        </td>
      </tr>
      <tr>
        <td>24 Hr Activity</td>
        <td>
          <NumberFormat
            value={props.Subreddit.one_day_total}
            thousandSeparator={true}
            displayType={'text'}
          />
        </td>
        <td>24 Hr Change</td>
        <td>{props.Subreddit.one_day_change}%</td>
      </tr>
      <tr>
        <td>7 day Activity</td>
        <td>
          <NumberFormat
            value={props.Subreddit.seven_day_total}
            thousandSeparator={true}
            displayType={'text'}
          />
        </td>
        <td>7 day Change</td>
        <td>{props.Subreddit.seven_day_change}%</td>
      </tr>
      <tr>
        <td>30 day Activity</td>
        <td>
          <NumberFormat
            value={props.Subreddit.thirty_day_total}
            thousandSeparator={true}
            displayType={'text'}
          />
        </td>
        <td>30 day Change</td>
        <td>{props.Subreddit.thirty_day_change}%</td>
      </tr>
    </tbody>
  </Table>
);

SubInfoCard.propTypes = {
  SubName: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
  Subreddit: PropTypes.object.isRequired
};

export default SubInfoCard;
