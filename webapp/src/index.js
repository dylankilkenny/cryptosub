import 'semantic-ui-css/semantic.min.css';
import 'react-github-button/assets/style.css';
import ReactDOM from 'react-dom';
import React from 'react';
import Menu from "./js/components/presentational/Menu";
import Modal from "./js/components/presentational/Modal";
import TableContainer from "./js/components/container/TableContainer";
import { Grid, Segment, Header, Icon, Button } from 'semantic-ui-react'
import GitHubButton from 'react-github-button';


class App extends React.Component {
    render() {
        return (
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column textAlign='center' >
                            <Segment>
                                <Grid verticalAlign='middle' columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                        </Grid.Column>
                                        <Grid.Column>
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <Header as='h2' textAlign='center'>
                                                CryptoCurrency Subreddit Tracker
                                            </Header>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Modal />
                                            
                                        </Grid.Column>
                                        <Grid.Column>
                                            <GitHubButton type="stargazers" size="large" namespace="dylankilkenny" repo="cryptosub" />
                                            
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
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




