import React from 'react';
import ChartContainer from "./ChartContainer";
import _ from 'lodash';
import { Grid, Segment, Icon, Button } from 'semantic-ui-react'


class SubredditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.storeData = this.storeData.bind(this);
    }

    componentDidMount() {
        var promises = []              
        const payload = JSON.stringify({ "subreddit": this.props.match.params.subreddit});
        const endpoints = [
            "CommentsPostsByDay", 
            "CurrencyMentionsByDay",
            "WordCountByDay",
            "BigramByDay",
            "Subreddit"
        ]
        for(var endpoint of endpoints){
            var p = fetch(API_URL + endpoint, {
                        method: "POST",
                        body: payload,
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then(response => { return response.json() })
            promises.push(p)
        }

        Promise.all(promises).then(values => {
            this.storeData(values)
            console.log(values[0]);
            console.log(values[1]);
            console.log(values[2]);
            console.log(values[3]);
            console.log(values[4]);
        });
    }

    componentDidCatch(error, info) {
        console.log(error)
        console.log(info)
    }

    storeData = (data) => {
        this.setState({
            CommentsPostsByDay: data[0]
        })
    }

    render() {
        return (
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ChartContainer 
                                CommentsPostsByDay={this.state.CommentsPostsByDay}
                            />
                        </Grid.Column>
                        
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default SubredditContainer
