import React from 'react'
import PropTypes from "prop-types";

import { Card, Icon, List, Label, Statistic, Grid, Segment, Header } from 'semantic-ui-react'
import NumberFormat from 'react-number-format';

const SubInfoCard = (props) => (

    <Grid textAlign = 'center' columns = 'equal' >
        <Grid.Row>
            <Grid.Column>
                <Statistic size='mini'>
                    <Statistic.Value>
                        <NumberFormat
                            value={props.Subreddit.no_posts}
                            thousandSeparator={true}
                            displayType={'text'}
                        />
                    </Statistic.Value>
                    <Statistic.Label>Total Posts</Statistic.Label>
                </Statistic>
            </Grid.Column>
            <Grid.Column>
                <Statistic size='mini'>
                    <Statistic.Value >
                        <NumberFormat
                            value={props.Subreddit.no_comments}
                            thousandSeparator={true}
                            displayType={'text'}
                        />
                    </Statistic.Value>
                    <Statistic.Label>Total Comments</Statistic.Label>
                </Statistic>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Statistic size='mini'>
                    <Statistic.Value>
                        <NumberFormat
                            value={props.Subreddit.one_day_total}
                            thousandSeparator={true}
                            displayType={'text'}
                        />
                    </Statistic.Value>
                    <Statistic.Label>24 Hr Activity</Statistic.Label>
                </Statistic>
            </Grid.Column>
            <Grid.Column>
                <Statistic size='mini' color={parseInt(props.Subreddit.one_day_change) < 0 ? 'red' : 'green'}>
                    <Statistic.Value>
                        {props.Subreddit.one_day_change}%
                        </Statistic.Value>
                    <Statistic.Label>24 Hr Change</Statistic.Label>
                </Statistic>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Statistic size='mini'>
                    <Statistic.Value>
                        <NumberFormat
                            value={props.Subreddit.seven_day_total}
                            thousandSeparator={true}
                            displayType={'text'}
                        />
                    </Statistic.Value>
                    <Statistic.Label>7 day Activity</Statistic.Label>
                </Statistic>
            </Grid.Column>
            <Grid.Column>
                <Statistic size='mini' color={parseInt(props.Subreddit.seven_day_change) < 0 ? 'red' : 'green'}>
                    <Statistic.Value>
                        {props.Subreddit.seven_day_change}%
                        </Statistic.Value>
                    <Statistic.Label>7 day Change</Statistic.Label>
                </Statistic>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Statistic size='mini'>
                    <Statistic.Value>
                        <NumberFormat
                            value={props.Subreddit.thirty_day_total}
                            thousandSeparator={true}
                            displayType={'text'}
                        />
                    </Statistic.Value>
                    <Statistic.Label>30 day Activity</Statistic.Label>
                </Statistic>
            </Grid.Column>
            <Grid.Column>
                <Statistic size='mini' color={parseInt(props.Subreddit.thirty_day_change) < 0 ? 'red' : 'green'}>
                    <Statistic.Value>
                        {props.Subreddit.thirty_day_change}%
                        </Statistic.Value>
                    <Statistic.Label>30 day Change</Statistic.Label>
                </Statistic>
            </Grid.Column>
        </Grid.Row>
        </Grid>
)

SubInfoCard.propTypes = {
    SubName: PropTypes.string.isRequired,
    payload: PropTypes.string.isRequired,
    Subreddit: PropTypes.object.isRequired
};

export default SubInfoCard

    