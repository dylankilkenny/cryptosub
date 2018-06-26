import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import React from 'react'
import { Segment, Grid, Header } from 'semantic-ui-react'
import { DateRangePicker } from 'react-dates';

class ChartHeaderSegment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            focusedInput: null
        }
        this.handleDateChange = this.handleDateChange.bind(this);
        
    }

    componentDidCatch(error, info) {
        console.log(error)
        console.log(info)
    }

    handleDateChange = (startDate, endDate) => {
        if (startDate != null && endDate != null){
            console.log("in")
            this.props.handleDateRange(startDate, endDate)
        }
        this.setState({ startDate, endDate })
    }

    render() {
        return (
            <Segment>
                <Grid verticalAlign='middle' columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                            <DateRangePicker
                                showClearDates={true}
                                small={true}
                                displayFormat="DD MMM  YY"
                                isOutsideRange={() => false}
                                startDate={this.state.startDate} 
                                startDateId="startDate" 
                                endDate={this.state.endDate}
                                endDateId="endDate"
                                onDatesChange={({ startDate, endDate }) => { this.handleDateChange(startDate, endDate)}}
                                focusedInput={this.state.focusedInput} 
                                onFocusChange={focusedInput => { this.setState({ focusedInput })}} 
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

export default ChartHeaderSegment
