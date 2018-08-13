import React from "react";
import PropTypes from "prop-types";
import { Icon, Label, Popup, Menu, Table } from "semantic-ui-react";
import TableRow from "./TableRow";

const TableCoin = props => (
  <Table unstackable compact sortable basic="very" color="blue">
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "#" ? props.direction : null}
          onClick={props.handleSort("rank", "#")}
        >
          #
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Subreddit" ? props.direction : null}
          onClick={props.handleSort("subreddit", "Subreddit")}
        >
          Subreddit
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Most Popular Coin" ? props.direction : null}
          onClick={props.handleSort("most_popular", "Most Popular Coin")}
        >
          Most Popular Coin
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Activity (24hr)" ? props.direction : null}
          onClick={props.handleSort("tf_hr_total", "Activity (24hr)")}
        >
          Activity (24hr)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Change (24hr)" ? props.direction : null}
          onClick={props.handleSort("tf_hr_change", "Change (24hr)")}
        >
          Change (24hr)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Activity (7d)" ? props.direction : null}
          onClick={props.handleSort("seven_day_total", "Activity (7d)")}
        >
          Activity (7d)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Change (7d)" ? props.direction : null}
          onClick={props.handleSort("seven_day_change", "Change (7d)")}
        >
          Change (7d)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Activity (30d)" ? props.direction : null}
          onClick={props.handleSort("thirty_day_total", "Activity (30d)")}
        >
          Activity (30d)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign="center"
          sorted={props.column === "Change (30d)" ? props.direction : null}
          onClick={props.handleSort("thirty_day_change", "Change (30d)")}
        >
          Change (30d)
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
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
    </Table.Body>
  </Table>
);

TableCoin.propTypes = {
  subreddits: PropTypes.array.isRequired,
  column: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  handleSort: PropTypes.func.isRequired
};

export default TableCoin;
