import React from 'react';
// import {
//   Button,
//   Responsive,
//   Header,
//   Icon,
//   Modal,
//   List,
//   Grid,
//   Divider
// } from 'semantic-ui-react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class FAQ extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <div>
        <div>
          <p className="nav-link" onClick={this.handleShow}>
            FAQ
          </p>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Frequently Asked Questions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p className="font-weight-bold">Is this site open source?</p>
              <p className="font-weight-light">
                Yes, available on{' '}
                <a href="https://github.com/dylankilkenny/cryptosub"> GitHub</a>
                .
              </p>
            </div>
            <div>
              <p className="font-weight-bold">
                What information does this site provide?
              </p>
              <p className="font-weight-light">
                Currently over 170 cryptocurrency subreddits are being tracked,
                providing real time stats such as daily activity, most popular
                coins and most frequently used words.
              </p>
            </div>
            <div>
              <p className="font-weight-bold">
                What does activity and change mean?
              </p>
              <p className="font-weight-light">
                In short, activity = Number of posts + Number of comments, for a
                given period. A subreddit with 10 posts + 98 comments would have
                an activity of 108. The main table provides activity over 24
                hour, 7 day and 30 day periods. Change is the difference between
                current and previous periods activity.
              </p>
            </div>
            <div>
              <p className="font-weight-bold">
                How is the most popular coin calculated?
              </p>
              <p className="font-weight-light">
                The names and ticker symbols for over 250 cryptocurrencies are
                compared against the word frequencies for a given subreddit, to
                determine which currency is the most discussed.
              </p>
            </div>
            <div>
              <p className="font-weight-bold">
                What is SMA, how is it calculated and why is it used?
              </p>
              <p className="font-weight-light">
                SMA stands for simple moving average and is an arithmetic moving
                average calculated by summing recent activity and then dividing
                that by the number of periods in the calculation average. The
                moving average smooths out the volatility of the comments and
                posts chart, to enable a more readable view of the trend.
              </p>
            </div>
            <div>
              <p className="font-weight-bold">
                What is total posts and total comments?
              </p>
              <p className="font-weight-light">
                These values are the total number of posts and comments analysed
                by this site. Currently this site has 3 months of crawled data.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default FAQ;
