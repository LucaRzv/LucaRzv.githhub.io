import React, { useContext }from 'react';
import { Card, Button, Icon, Label, Image } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/authentification';
import Love from './LoveButton';
import DeleteButton from '../components/DeleteButton.js';

// create function to return what to display on homepage
// deconstruct the props post directly in the parameters
function PostDisplay ({ 
    post: {id, contains, username, comments, commCount, likes, likeCount, datePosted}
    }) {

    const context = useContext(AuthContext);    
    
    function likePost() {
        console.log('Liked')
    }

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='tiny'
                    src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                />
            <Card.Header>{username}</Card.Header>
            {/*extract current time minus date when it was posted to get difference*/}
            <Card.Meta>{moment(datePosted).fromNow()}</Card.Meta>
            <Card.Description>
                {contains}
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Love user={context.user} post={{id, likes, likeCount}}/>
                <Button labelPosition='left' as={Link} to={`/posts/${id}`}>
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
    )
}

export default PostDisplay;