import React from 'react';
import {
  Button,
  Responsive,
  Header,
  Icon,
  Modal,
  List,
  Grid,
  Divider
} from 'semantic-ui-react';

const ModalExampleCloseIcon = () => (
  <Modal
    trigger={
      <div>
        <Responsive minWidth={768}>
          <Button color="yellow" icon="question circle" content="FAQ" />
        </Responsive>
        <Responsive maxWidth={768}>
          <Button size="tiny" color="yellow" content="FAQ" />
        </Responsive>
      </div>
    }
    centered={false}
    closeIcon
  >
    <Header icon="question circle" content="FAQ" />
    <Modal.Content>
      <Grid verticalAlign="middle" columns="equal">
        <Grid.Row>
          <Grid.Column width={2} />
          <Grid.Column>
            <List size="big">
              <List.Item>
                <List.Header>Is this site open source?</List.Header>
                Yes, available on github. Contributions welcome.
              </List.Item>
              <List.Item>
                <List.Header>
                  What information does this site provide?
                </List.Header>
                Currently over 170 cryptocurrency subreddits are being tracked,
                providing real time stats such as daily activity, most popular
                coins and most frequently used words.
              </List.Item>
              <List.Item>
                <List.Header>What does activity and change mean?</List.Header>
                In short, activity = Number of posts + Number of comments, for a
                given period. A subreddit with 10 posts + 98 comments would have
                an activity of 108. The main table provides activity over 24
                hour, 7 day and 30 day periods.
                <p>
                  Change is the difference between current and previous periods
                  activity.{' '}
                </p>
              </List.Item>
              <List.Item>
                <List.Header>
                  How is the most popular coin calculated?
                </List.Header>
                The names and ticker symbols for over 250 cryptocurrencies are
                compared against the word frequencies for a given subreddit, to
                determine which currency is the most discussed.
              </List.Item>
              <List.Item>
                <List.Header>
                  What is SMA, how is it calculated and why is it used?
                </List.Header>
                SMA stands for simple moving average and is an arithmetic moving
                average calculated by summing recent activity and then dividing
                that by the number of periods in the calculation average. The
                moving average smooths out the volatility of the comments and
                posts chart, to enable a more readable view of the trend.
              </List.Item>
              <List.Item>
                <List.Header>
                  What is total posts and total comments?
                </List.Header>
                These values are the total number of posts and comments analysed
                by this site. Currently this site has 3 months of crawled data.
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>
    </Modal.Content>
  </Modal>
);

export default ModalExampleCloseIcon;
