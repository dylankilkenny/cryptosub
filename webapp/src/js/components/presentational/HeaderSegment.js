import React from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { FaHeart } from 'react-icons/fa/';
import { FaRedditSquare } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import DonateModal from '../presentational/Donate';

export default class HeaderSegment extends React.Component {
  state = { activeItem: 'home' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  modalClose = () => this.setState({ modalShow: false });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Navbar collapseOnSelect expand="lg">
          <Navbar.Brand>
            <IconContext.Provider value={{ color: 'black', size: '1.2em' }}>
              <FaRedditSquare />
            </IconContext.Provider>
            <Link className="nav-brand" to="/">
              Crypto Subreddit Tracker
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="mr-auto">
              <Navbar.Text>
                <Link className="nav-link" to="/Compare">
                  Compare Activity
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Modal />
              </Navbar.Text>
            </Nav>
            <Navbar.Text>
              <Button
                variant="info"
                onClick={() => this.setState({ modalShow: true })}
              >
                Support &nbsp;
                <IconContext.Provider value={{ color: 'red' }}>
                  <FaHeart />
                </IconContext.Provider>
              </Button>
              <DonateModal
                show={this.state.modalShow}
                onHide={this.modalClose}
              />
            </Navbar.Text>
            {/* <Navbar.Text>
              <GitHubButton
                type="stargazers"
                size="large"
                namespace="dylankilkenny"
                repo="cryptosub"
              />
            </Navbar.Text> */}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
