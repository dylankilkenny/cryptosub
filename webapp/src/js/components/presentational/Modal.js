import React from 'react'
import { Button, Header, Icon, Modal, List, Grid } from 'semantic-ui-react'


const ModalExampleCloseIcon = () => (
    <Modal trigger={<Button color='yellow' icon='question circle' content='FAQ' />} centered={false} closeIcon>
        <Header icon='question circle' content='FAQ' />
        <Modal.Content>
            <Grid verticalAlign='middle' columns='equal'>
                <Grid.Row>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column>
                        <List size="big">
                            <List.Item>
                                <List.Header>Is this site open source?</List.Header>
                                The project is fully open source on Github.
                            </List.Item>
                            <List.Item>
                                <List.Header>What information does this site provide?</List.Header>
                                Currently over 170 cryptocurrency subreddits are being tracked, providing real time stats such as daily activity, most popular coins and most frequently used words.
                            </List.Item>
                            <List.Item>
                                <List.Header>What is activity and change</List.Header>
                                In short, activity = Number of posts + Number of comments, for a given period. A subreddit with 10 posts + 98 comments would have an activity of 108. The main table provides activity over 24 hour, 7 day and 30 day periods.
                                <p>Change is the difference between current and previous periods activity. </p>
                            </List.Item>
                            <List.Item>
                                <List.Header>How is the most popular coin calculated?</List.Header>
                                The ticker symbols for over 250 cryptocurrencies are compared against the word frequencies to determine which currency is the most mentioned.
                            </List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>


        </Modal.Content>
    </Modal>
)

export default ModalExampleCloseIcon
