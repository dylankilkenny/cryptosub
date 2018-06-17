import 'semantic-ui-css/semantic.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import Menu from "./js/components/presentational/Menu";
import TableContainer from "./js/components/container/TableContainer";
import { Grid, Segment } from 'semantic-ui-react'


class App extends React.Component {
    render() {
        return (
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                        </Grid.Column>
                        <Grid.Column textAlign='center' width={12}>
                            <h1 style={{ color: '#096dd9' }}>
                                CryptoSubs
                            </h1>
                        </Grid.Column>
                        <Grid.Column>
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
