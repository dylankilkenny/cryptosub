import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Tooltip from 'react-bootstrap/Tooltip';

const CompareChartSelect = ({
  selected,
  subredditList,
  handleChange,
  handleSubredditRemoval
}) => {
  const listItems = selected.map((item, i) => (
    <ListGroup.Item key={i} action>
      {item}
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-bottom`}>Remove Subreddit</Tooltip>}
      >
        <span
          onClick={() => handleSubredditRemoval(item)}
          style={{ float: 'right' }}
        >
          ╳
        </span>
      </OverlayTrigger>
    </ListGroup.Item>
  ));

  const dropdownItems = subredditList.map((item, i) => (
    <option key={i}>{item.value}</option>
  ));
  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Body>
        <div className="form-group">
          <label htmlFor="select-subreddit">Add Subreddits</label>
          <select
            onChange={handleChange}
            className="form-control"
            id="select-subreddit"
          >
            <option>...</option>
            {dropdownItems}
          </select>
        </div>
        <ListGroup>{listItems}</ListGroup>
      </Card.Body>
    </Card>
  );
};

export default CompareChartSelect;
