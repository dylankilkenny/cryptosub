import React from 'react';
import ChartContainer from './ChartContainer';
import PopularCoinsContainer from './PopularCoinsContainer';
import WordsFreqContainer from './WordsFreqContainer';
import SubInfoCard from '../presentational/SubInfoCard';
import MainContentGrid from '../presentational/MainContentGrid';
import _ from 'lodash';
import { Grid, Header, Tab } from 'semantic-ui-react';
import BigramsFreqContainer from './BigramsFreqContainer';

class SubredditContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: JSON.stringify({ subreddit: this.props.match.params.subreddit }),
      panesHashbang: [
        '#CommentsandPosts',
        '#MostPopularCoins',
        '#WordFrequency',
        '#BigramFrequency'
      ],
      activeIndex: 0
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.storeData = this.storeData.bind(this);
  }

  componentDidMount() {
    const endpoint = 'Subreddit';
    fetch(API_URL + endpoint, {
      method: 'POST',
      body: this.state.payload,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        return response.json();
      })
      .then(data => this.storeData(data));
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  storeData = data => {
    const CurrencyMentions = _.orderBy(
      data[0].currency_mentions,
      ['n'],
      ['desc']
    );
    const word_freq = _.orderBy(data[0].word_freq, ['n'], ['desc']);
    const bigram_freq = _.orderBy(data[0].bigram_freq, ['n'], ['desc']);

    const hashbang = window.location.hash;
    let activeIndex;
    if (hashbang) {
      activeIndex = this.state.panesHashbang.indexOf(hashbang);
    } else {
      activeIndex = 0;
    }
    this.setState({
      Subreddit: data[0],
      CurrencyMentions: CurrencyMentions.slice(0, 10),
      word_freq: word_freq.slice(0, 20),
      bigram_freq: bigram_freq.slice(0, 15),
      activeIndex: activeIndex
    });
  };

  handleTabChange = (e, { activeIndex }) => {
    const paneTitle = this.state.panesHashbang[activeIndex];
    window.history.replaceState(null, null, paneTitle);
    this.setState({ activeIndex });
  };

  render() {
    const panes = [
      {
        menuItem: 'Comments and Posts',
        render: () => (
          <Tab.Pane>
            <Header textAlign="center" as="h2">
              Comments and Posts
            </Header>
            <ChartContainer
              CommentsPostsByDay={this.state.CommentsPostsByDay}
              payload={this.state.payload}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Most Popular Coins',
        render: () => (
          <Tab.Pane>
            <PopularCoinsContainer
              payload={this.state.payload}
              CurrencyMentions={this.state.CurrencyMentions}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Word Frequency',
        render: () => (
          <Tab.Pane>
            <WordsFreqContainer
              payload={this.state.payload}
              word_freq={this.state.word_freq}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Bigram Frequency',
        render: () => (
          <Tab.Pane>
            <BigramsFreqContainer
              payload={this.state.payload}
              bigram_freq={this.state.bigram_freq}
            />
          </Tab.Pane>
        )
      }
    ];
    return (
      <div>
        <MainContentGrid width={14}>
          <Grid stackable>
            <Grid.Row stretched>
              <Grid.Column width={4}>
                <Header as="h1">
                  <a
                    href={`http://reddit.com/r/${
                      this.props.match.params.subreddit
                    }`}
                  >
                    r/
                    {this.props.match.params.subreddit}
                  </a>
                </Header>
              </Grid.Column>
              <Grid.Column width={12}>
                <SubInfoCard
                  SubName={this.props.match.params.subreddit}
                  payload={this.state.payload}
                  Subreddit={this.state.Subreddit}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Tab
                  activeIndex={this.state.activeIndex}
                  onTabChange={this.handleTabChange}
                  panes={panes}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MainContentGrid>
      </div>
    );
  }
}

export default SubredditContainer;
