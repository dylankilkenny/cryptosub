import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import _ from "lodash";
import ChartHeaderSegment from "../presentational/ChartHeaderSegment";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, Legend } from 'recharts';

class ChartContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null
        }
        this.storeData = this.storeData.bind(this);
        this.handleDateRange = this.handleDateRange.bind(this);
    }
    componentDidMount() {
        fetch(API_URL + "CommentsPostsByDay", {
            method: "POST",
            body: this.props.payload,
            headers: { 'Content-Type': 'application/json' },
            })
            .then(response => { return response.json() })
            .then(json => this.storeData(json))
    }

    componentDidCatch(error, info) {
        console.log(error)
        console.log(info)
    }

    storeData = (data) => {
        const closest_date = moment(data[data.length-1].Date)
        const furthest_date = moment(data[data.length-1].Date).subtract(7, "days");
        this.setState({
            startDate: furthest_date,
            endDate: closest_date,
            CommentsPostsByDay: data
        },()=>{
            this.handleDateRange(furthest_date, closest_date)
        })
    }

    handleDateRange = (startDate, endDate) => {
        let filtered = _.filter(this.state.CommentsPostsByDay, function(o) {
            return moment(o.Date).isBetween(startDate, endDate);
        });
        this.setState({
            filteredCommPosts: filtered,
            startDate: startDate,
            endDate: endDate
        })
    }


    render() {
        return (
            <div >
                <ChartHeaderSegment
                    handleDateRange={this.handleDateRange}
                />
                <ResponsiveContainer width="99%" height={300}>
                    <LineChart data={this.state.filteredCommPosts}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis minTickGap={15} dataKey="MonthDay" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            name="# Posts"
                            dot={false}
                            connectNulls={true}
                            strokeWidth={2}
                            yAxisId="left"
                            type="monotone"
                            dataKey="n_post"
                            stroke="#8884d8"
                        />
                        <Line
                            name="# Comments"
                            dot={false}
                            connectNulls={true}
                            strokeWidth={2}
                            yAxisId="right"
                            type="monotone"
                            dataKey="n_comment"
                            stroke="#82ca9d"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default ChartContainer
