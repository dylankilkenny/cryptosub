import React from "react";
import PropTypes from "prop-types";

import HeaderSegment from "./HeaderSegment";
import Footer from "./Footer";
import {
  Button,
  Header,
  Icon,
  Modal,
  List,
  Grid,
  Card,
  Responsive
} from "semantic-ui-react";

const MainContentGrid = ({ children, width }) => (
  <div>
    <Responsive minWidth={768}>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column textAlign="center">
            <HeaderSegment />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column />
          <Grid.Column width={width}>{children}</Grid.Column>
          <Grid.Column />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Footer />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Responsive>

    <Responsive maxWidth={768}>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column textAlign="center">
            <HeaderSegment />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={width}>{children}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Footer />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Responsive>
  </div>
);

MainContentGrid.propTypes = {
  width: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired
};

export default MainContentGrid;
