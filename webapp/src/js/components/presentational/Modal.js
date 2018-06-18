import React from 'react'
import { Button, Header, Icon, Modal, List, Grid, Card } from 'semantic-ui-react'


const ModalExampleCloseIcon = () => (
    <Modal trigger={<Button color='yellow' icon='question circle' content='More Info' />} centered={false} closeIcon>
        <Header icon='question circle' content='More Info' />
        <Modal.Content>
            <h4 style={{ textAlign: 'center' }}>Cryptocurrency Subreddit Tracker is an open source project keeping track of over 170 crypto subreddits.</h4>
            <Grid verticalAlign='middle' columns='equal'>
                <Grid.Row>
                    <Grid.Column>
                        <Card centered={true}>
                            <Card.Content header='Upcoming Features' />
                            <Card.Content description={
                                <List bulleted>
                                    <List.Item>
                                        Chart displaying comments and posts by day
                                    </List.Item>
                                    <List.Item>
                                        View most active users
                                    </List.Item>
                                    <List.Item>
                                        View most discussed cryptocurrencies
                                    </List.Item>
                                    <List.Item>
                                        View most used words in discussions
                                    </List.Item>
                                </List>
                            } />
                        </Card>
                    </Grid.Column>
                    {/* <Grid.Column>
                    </Grid.Column> */}
                </Grid.Row>
            </Grid>


        </Modal.Content>
    </Modal>
)

export default ModalExampleCloseIcon
