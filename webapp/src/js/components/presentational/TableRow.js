import React from "react";
import PropTypes from "prop-types";
import NumberFormat from 'react-number-format';
import { Icon, Grid, Label, Menu, Table, Image } from "semantic-ui-react"
import { Link } from 'react-router-dom'

const TableRow = (props) => (
    <Table.Row textAlign='center'>
        {/* <Table.Cell>{props.rank}</Table.Cell> */}
        <Table.Cell textAlign='left'>
            <Link to={`/${props.subreddit}`}>
                r/{props.subreddit}
            </Link>
        </Table.Cell>
        <Table.Cell textAlign='left'>
            <h5>{props.most_popular}</h5>
        </Table.Cell>
        <Table.Cell>
            <NumberFormat
                value={props.tf_hr_total}
                thousandSeparator={true}
                displayType={'text'}
            />
        </Table.Cell>
        <Table.Cell>
            <Label
                color={parseInt(props.tf_hr_change) < 0 ? 'red' : 'green'}
                horizontal>{parseInt(props.tf_hr_change)}%
            </Label>
        </Table.Cell>
        <Table.Cell>
            <NumberFormat
                value={props.seven_day_total}
                thousandSeparator={true}
                displayType={'text'}
            />
        </Table.Cell>
        <Table.Cell>
            <Label
                color={parseInt(props.seven_day_change) < 0 ? 'red' : 'green'}
                horizontal>{parseInt(props.seven_day_change)}%
            </Label>
        </Table.Cell>
        <Table.Cell>
            <NumberFormat
                value={props.thirty_day_total}
                thousandSeparator={true}
                displayType={'text'}
            />
        </Table.Cell>
        <Table.Cell>
            <Label
                color={parseInt(props.thirty_day_change) < 0 ? 'red' : 'green'}
                horizontal>{parseInt(props.thirty_day_change)}%
            </Label>
        </Table.Cell>
        <Table.Cell>
            <NumberFormat
                value={props.market_cap_usd}
                thousandSeparator={true}
                displayType={'text'}
            />
        </Table.Cell>
    </Table.Row>
)

export default TableRow
