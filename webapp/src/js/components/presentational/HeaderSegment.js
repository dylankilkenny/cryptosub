import React from 'react';
import { Header, Button, Icon, Menu } from 'semantic-ui-react';
import GitHubButton from 'react-github-button';
import MoneyButton from '@moneybutton/react-money-button';
import Modal from './Modal';
import { Link } from 'react-router-dom';

export default class HeaderSegment extends React.Component {
  state = { activeItem: 'home' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu secondary>
          <Menu.Item>
            <Header as="h2" textAlign="center">
              <Icon name="reddit square" size="mini" />
              Crypto Subreddit Tracker
            </Header>
          </Menu.Item>
          <Menu.Item as={Link} to="/">
            <Button size="small" color="yellow" content="Home" />
          </Menu.Item>
          <Menu.Item as={Link} to="/Compare">
            <Button size="small" color="yellow" content="Compare Activity" />
          </Menu.Item>
          <Menu.Item>
            <Modal />
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item>
              <GitHubButton
                type="stargazers"
                size="large"
                namespace="dylankilkenny"
                repo="cryptosub"
              />
            </Menu.Item>
            <Menu.Item position="right">
              <MoneyButton
                to="54"
                amount="0.002"
                currency="BCH"
                label="€1 Donate"
                hideAmount={false}
                clientIdentifier="5af02e253b87ef334b081d74e4182b1b"
                buttonId="1537026561224"
                type="tip"
                size="small"
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
