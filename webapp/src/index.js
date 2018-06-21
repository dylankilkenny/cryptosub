import 'semantic-ui-css/semantic.min.css';
import 'react-github-button/assets/style.css';
import ReactDOM from 'react-dom';
import React from 'react';
import HeaderSegment from "./js/components/presentational/HeaderSegment";
import TableContainer from "./js/components/container/TableContainer";
import { Grid, Segment, Icon, Button } from 'semantic-ui-react'


class App extends React.Component {
    render() {
        return (
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column textAlign='center' >
                            <HeaderSegment/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <TableContainer />
                        </Grid.Column>
                        <Grid.Column>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));




