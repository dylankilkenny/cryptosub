import React from "react";
import { Segment, Grid, Header, Responsive, Icon } from "semantic-ui-react";
import GitHubButton from "react-github-button";
import Modal from "./Modal";
import { Link } from "react-router-dom";

const HeaderSegment = props => (
  <Grid columns="equal">
    <Grid.Row>
      <Grid.Column />
      <Grid.Column />
    </Grid.Row>
  </Grid>
);

export default HeaderSegment;
