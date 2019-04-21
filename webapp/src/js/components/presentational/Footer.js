import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const HeaderSegment = props => (
  <Container>
    <Row>
      <Col>
        <div style={{ marginTop: 50, marginBottom: 30 }}>
          <hr />
          Made by{' '}
          <a href="https://github.com/dylankilkenny/cryptosub"> Dylan</a>
        </div>
      </Col>
    </Row>
  </Container>
);

export default HeaderSegment;
