import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, Legend } from 'recharts';

class ChartContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        this.storeData = this.storeData.bind(this);
    }
    componentWillMount(){
        this.storeData(this.props.CommentsPostsByDay)
    }

    componentDidCatch(error, info) {
        console.log(error)
        console.log(info)
    }

    storeData = (data) => {
        this.setState({
            CommentsPostsByDay: data
        })
    }

    render() {
        const CommentsPostsByDay = this.state.CommentsPostsByDay;
        return (
            <div >
                <ResponsiveContainer width="99%" height={300}>
                    <LineChart  data={CommentsPostsByDay.slice(-100)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis minTickGap={15} dataKey="MonthDay" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right"/>
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
