import React from 'react';
import ChartContainer from "./ChartContainer";
import PopularCoinsContainer from "./PopularCoinsContainer";
import WordsFreqContainer from "./WordsFreqContainer";
import SubInfoCard from "../presentational/SubInfoCard";
import MainContentGrid from "../presentational/MainContentGrid";
import _ from 'lodash';
import { Grid, Segment, Icon, Button, Header, Tab } from 'semantic-ui-react'
import BigramsFreqContainer from './BigramsFreqContainer';


class SubredditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payload: JSON.stringify({ "subreddit": this.props.match.params.subreddit })
        }
        this.storeData = this.storeData.bind(this);
    }

    componentDidMount() {
        var promises = []
        const endpoints = [
            // "CommentsPostsByDay",
            // "CurrencyMentionsByDay",
            // "WordCountByDay",
            // "BigramByDay",
            "Subreddit"
        ]
        for (var endpoint of endpoints) {
            var p = fetch(API_URL + endpoint, {
                method: "POST",
                body: this.state.payload,
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => { return response.json() })
            promises.push(p)
        }

        Promise.all(promises).then(values => {
            this.storeData(values[0])
            console.log(values[0][0]);
            // console.log(values[1]);
            // console.log(values[2]);
            // console.log(values[3]);
            // console.log(values[4]);
        });
    }

    componentDidCatch(error, info) {
        console.log(error)
        console.log(info)
    }

    storeData = (data) => {
        const CurrencyMentions = _.orderBy(data[0].currency_mentions, ['n'], ['desc'])
        const WordCount = _.orderBy(data[0].word_count, ['n'], ['desc'])
        const BigramCount = _.orderBy(data[0].bigram_count, ['n'], ['desc'])
        this.setState({
            Subreddit: data[0],
            CurrencyMentions: CurrencyMentions.slice(0, 10),
            WordCount: WordCount.slice(0, 20),
            BigramCount: BigramCount.slice(0, 15)
        })

    }

    render() {
        const panes = [
            {
                menuItem: 'Most Popular Coins', render: () =>
                    <Tab.Pane>
                        <PopularCoinsContainer
                            payload={this.state.payload}
                            CurrencyMentions={this.state.CurrencyMentions}
                        />
                    </Tab.Pane>
            },
            {
                menuItem: 'Word Frequency', render: () =>
                    <Tab.Pane>

                        <WordsFreqContainer
                            payload={this.state.payload}
                            WordCount={this.state.WordCount}
                        />
                    </Tab.Pane>
            },
            {
                menuItem: 'Bigram Frequency', render: () =>
                    <Tab.Pane>
                        <BigramsFreqContainer
                            payload={this.state.payload}
                            BigramCount={this.state.BigramCount}
                        />
                    </Tab.Pane>
            },
        ]

        return (
            <div>
                <MainContentGrid
                    width={14}>
                    <Grid stackable>
                        <Grid.Row stretched>
                            <Grid.Column width={4}>
                                <Segment>
                                    <Header textAlign='center' as='h2'>
                                        Stats
                                    </Header>
                                    <SubInfoCard
                                        SubName={this.props.match.params.subreddit}
                                        payload={this.state.payload}
                                        Subreddit={this.state.Subreddit}
                                    />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Segment>
                                    <Header textAlign='center' as='h2'>
                                        Comments and Posts
                                    </Header>
                                    <ChartContainer
                                        CommentsPostsByDay={this.state.CommentsPostsByDay}
                                        payload={this.state.payload}
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Tab panes={panes} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </MainContentGrid>
            </div>
        )
    }
}

export default SubredditContainer
