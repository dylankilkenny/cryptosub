import React from 'react'
import PropTypes from "prop-types";

import HeaderSegment from "./HeaderSegment";
import { Button, Header, Icon, Modal, List, Grid, Card } from 'semantic-ui-react'


const MainContentGrid = ({children, width}) => (
    <Grid columns='equal'>
        <Grid.Row>
            <Grid.Column textAlign='center' >
                <HeaderSegment />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column width={width}>
                {children}
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

MainContentGrid.propTypes = {
    width: PropTypes.number.isRequired,
    children: PropTypes.element.isRequired
};


export default MainContentGrid
