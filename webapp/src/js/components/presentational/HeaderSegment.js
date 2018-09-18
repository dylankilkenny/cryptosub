import React from 'react';
import { Segment, Grid, Header, Button, Icon } from 'semantic-ui-react';
import GitHubButton from 'react-github-button';
// import MoneyButton from 'react-money-button';
import Modal from './Modal';
import { Link } from 'react-router-dom';

const HeaderSegment = props => (
  <Segment>
    <Grid verticalAlign="middle" columns="equal">
      <Grid.Row>
        <Grid.Column>
          {window.location.pathname != '/' ? (
            <Link to={`/`}>
              <Icon
                size="big"
                color="yellow"
                name="arrow alternate circle left outline"
              />
            </Link>
          ) : null}
        </Grid.Column>
        <Grid.Column>
          <Link to={`/Compare`}>
            <Button size="small" color="yellow" content="Compare Activity" />
          </Link>
          {/* <MoneyButton
            to={}
            amount={1}
            currency="EUR"
            label="€1 Donate"
            hideAmount={false}
            clientIdentifier=""
            buttonId=""
            type="tip"
          /> */}
        </Grid.Column>
        <Grid.Column mobile={4} width={6}>
          <Header as="h2" textAlign="center">
            Crypto Subreddit Tracker
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Modal />
        </Grid.Column>
        <Grid.Column>
          <GitHubButton
            type="stargazers"
            size="large"
            namespace="dylankilkenny"
            repo="cryptosub"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

export default HeaderSegment;
