import React, {useContext, useState} from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import {Grid, Image, Card, Button, Label, Icon, Comment, Header, Form} from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/authentification';
import Love from '../components/LoveButton';
import DeleteButton from '../components/DeleteButton.js'

export default function PostPage(props) {
    const context = useContext(AuthContext);
    // get id of the post from the props
    const postID = props.match.params.postID;

    const [comment, setComment] = useState('')

    const { data: { getPost } = {}} = useQuery(getPostQL, {
        variables: {
            postID
        }
    })

    const [createComment] = useMutation(submitCommentQL, {
        update(){
            setComment('')
        },
        variables: {
            postID,
            contains: comment
        }
    })

    let _post;

    if(!getPost){
        _post = <p>Loading post...</p>
    }
    else {
        const { id, contains, datePosted, username, comments, likes, likeCount, commCount } = getPost;

        _post = (
            <Grid style={{margin:'auto'}}>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                        src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                        size= 'medium'
                        floated='right'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(datePosted).fromNow()}</Card.Meta>
                                <Card.Description>
                                {contains}
                                </Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <Love user={context.user} post={{id, likes, likeCount}}/>
                                <Button labelPosition='left' >
                                    <Button color='blue' basic>
                                        <Icon name='comments' />
                                            Comments
                                    </Button>
                                    <Label as='a' basic color='blue' pointing='left'>
                                        {commCount}
                                    </Label>
                                </Button>
                                {context.user && context.user.username === username && <DeleteButton postID={id}/>}
                                </Card.Content>
                        </Card>
                        <Comment.Group>
                            <Header as='h3' dividing>
                                Comments
                            </Header>
                        {context.user && (
                            <Form>
                                <Form.TextArea placeholder="..." value={comment} onChange={event => setComment(event.target.value)}/>
                                    <Button content='Add a comment' labelPosition='left' icon='edit' primary onClick={createComment}/>
                            </Form>
                        )}    
                        {comments.map(comment => (
                            <Comment style={{marginBottom: 15}} key={comment.id}>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                    <Comment.Content>
                                    {context.user && context.user.username === comment.username && (
                                        <DeleteButton postID={id} commentID={comment.id}/>
                                    )}
                                        <Comment.Author as='a'>{comment.username}</Comment.Author>
                                            <Comment.Metadata>
                                                <div>{moment(comment.datePosted).fromNow()}</div>
                                        </Comment.Metadata>
                                        <Comment.Text>{comment.contains}</Comment.Text>
                                </Comment.Content>
                            </Comment>
                        ))}
                        </Comment.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return _post;
}

const getPostQL = gql`
    query($postID: ID!){
        getPost(postID: $postID){
            id contains datePosted username likeCount
            likes {
                username
            }
            commCount
            comments {
                id username datePosted contains
            }
        }
    }
`

const submitCommentQL = gql`
    mutation createComment($postID: ID!, $contains: String!){
        createComment(postID: $postID, contains: $contains){
            id contains datePosted username likeCount
            likes {
                username
            }
            commCount
            comments {
                id username datePosted contains
            }
        }
    }
`