import React from 'react';
import ChartContainer from './ChartContainer';
import PopularCoinsContainer from './PopularCoinsContainer';
import SubInfoCard from '../presentational/SubInfoCard';
import MainContentGrid from '../presentational/MainContentGrid';
import orderBy from 'lodash/orderBy';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

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
    this.testTabReload = this.testTabReload.bind(this);
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
    const CurrencyMentions = orderBy(
      data[0].currency_mentions,
      ['n'],
      ['desc']
    );
    const word_freq = orderBy(data[0].word_freq, ['n'], ['desc']);
    const bigram_freq = orderBy(data[0].bigram_freq, ['n'], ['desc']);

    this.setState({
      Subreddit: data[0],
      CurrencyMentions: CurrencyMentions.slice(0, 10),
      word_freq: word_freq.slice(0, 20),
      bigram_freq: bigram_freq.slice(0, 15)
    });
  };

  handleTabChange = key => {
    window.history.replaceState(null, null, '#' + key);
  };

  testTabReload = () => {
    this.forceUpdate();
  };

  render() {
    if (!this.state.Subreddit) {
      return <div />;
    }
    return (
      <div>
        <MainContentGrid width={14}>
          <Container>
            <Row className="justify-content-md-center">
              <Col sm="12" md="4">
                <h3>
                  <a
                    href={`http://reddit.com/r/${
                      this.props.match.params.subreddit
                    }`}
                  >
                    r/
                    {this.props.match.params.subreddit}
                  </a>
                </h3>
              </Col>
              <Col sm="12" md="8">
                <SubInfoCard
                  SubName={this.props.match.params.subreddit}
                  payload={this.state.payload}
                  Subreddit={this.state.Subreddit}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col sm="12" md="12">
                <Tabs
                  mountOnEnter
                  unmountOnExit
                  transition={false}
                  defaultActiveKey="CommentsAndPosts"
                  id="uncontrolled-tab-example"
                  onSelect={this.handleTabChange}
                >
                  <Tab eventKey="CommentsAndPosts" title="Comments And Posts">
                    <br />
                    <ChartContainer payload={this.state.payload} />
                  </Tab>
                  <Tab eventKey="MostPopularCoins" title="Most Popular Coins">
                    <br />
                    <PopularCoinsContainer
                      payload={this.state.payload}
                      CurrencyMentions={this.state.CurrencyMentions}
                    />
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Container>
        </MainContentGrid>
      </div>
    );
  }
}

export default SubredditContainer;
