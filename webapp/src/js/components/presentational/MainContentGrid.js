import React from 'react';
import PropTypes from 'prop-types';
import HeaderSegment from './HeaderSegment';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Footer from './Footer';

const MainContentGrid = ({ children }) => (
  <Container>
    <Row>
      <Col>
        <HeaderSegment />
      </Col>
    </Row>
    <Row>
      <Col>{children}</Col>
    </Row>
    <Row>
      <Col>
        <Footer />
      </Col>
    </Row>
  </Container>
);

MainContentGrid.propTypes = {
  children: PropTypes.element.isRequired
};

export default MainContentGrid;
