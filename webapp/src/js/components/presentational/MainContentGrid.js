import React from 'react'
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

export default MainContentGrid
