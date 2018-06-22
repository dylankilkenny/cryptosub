import 'semantic-ui-css/semantic.min.css';
import 'react-github-button/assets/style.css';
import ReactDOM from 'react-dom';
import React from 'react';
import HeaderSegment from "./js/components/presentational/HeaderSegment";
import TableContainer from "./js/components/container/TableContainer";
import SubredditContainer from "./js/components/container/SubredditContainer";
import { Grid, Segment, Icon, Button } from 'semantic-ui-react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'


class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Grid columns='equal'>
                        <Grid.Row>
                            <Grid.Column textAlign='center' >
                                <HeaderSegment />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Switch>
                                    <Route exact path='/' component={TableContainer} />
                                    <Route path='/:subreddit' component={SubredditContainer} />
                                </Switch>
                            </Grid.Column>
                            <Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));




