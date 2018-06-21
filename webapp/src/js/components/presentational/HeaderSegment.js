import React from 'react'
import { Segment, Grid, Header } from 'semantic-ui-react'
import GitHubButton from 'react-github-button';
import Modal from "./Modal";



const HeaderSegment = () => (
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
)

export default HeaderSegment
