import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Icon, Label} from 'semantic-ui-react';

import { AuthContext } from '../context/authentification';

export default function Love({post: {id, likes, likeCount} }) {
    const context = useContext(AuthContext);

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if(context.user && likes.find(like => like.username === context.user.username)){
            setLiked(true);
        }
        else setLiked(false);
    },[context.user, likes]);

    const [likePost] = useMutation(likePostQL, {
        variables: {postID: id},
        onError(err){
            return err
        }
    });

    const loveButton = context.user ? (
        liked ? (
            <Button color='red'>
                <Icon name='heart' />
                    Love
            </Button>
        ) :  (
            <Button color='red' basic>
                <Icon name='heart' />
                    Love
            </Button>
        )
    ) : (
        <Button as={Link} to='/login' color='red' basic>
            <Icon name='heart' />
                Love
        </Button>
    )

    return(
                <Button as='div' labelPosition='right' onClick={likePost}>
                {loveButton}
                <Label as='a' basic color='red' pointing='left'>
                    {likeCount}
                </Label>
                </Button>
    )
} 

const likePostQL = gql`
    mutation likePost($postID: ID!){
        likePost(postID: $postID){
            id
            likes{
                id
                username
            }
            likeCount
        }
    }
`