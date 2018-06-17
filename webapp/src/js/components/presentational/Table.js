import React from "react";
import PropTypes from "prop-types";
import { Icon, Label, Popup, Menu, Table } from "semantic-ui-react"
import TableRow from "./TableRow"

const TableCoin = (props) => (
  <Table sortable basic color="blue">
    <Table.Header>
        <Table.HeaderCell
          textAlign='center'>
          #
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign='center'>
          Subreddit
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign='center'>
          Total (24hr)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign='center'>
          Change (24hr)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign='center'>
          Total (7d)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign='center'>
          Change (7d)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign='center'>
          Total (30d)
        </Table.HeaderCell>
        <Table.HeaderCell
          textAlign='center'>
          Change (30d)
        </Table.HeaderCell>
    </Table.Header>
    <Table.Body>
      {
        props.subreddits.map((sub, index) => (
          <TableRow
            key={index}
            rank={sub.rank}
            subreddit={sub.subreddit}
            tf_hr_total={sub.tf_hr_total}
            tf_hr_change={sub.tf_hr_change}
            seven_day_total={sub.seven_day_total}
            seven_day_change={sub.seven_day_change}
            thirty_day_total={sub.thirty_day_total}
            thirty_day_change={sub.thirty_day_change}
          />
        ))
      }
    </Table.Body>
  </Table>
);

export default TableCoin