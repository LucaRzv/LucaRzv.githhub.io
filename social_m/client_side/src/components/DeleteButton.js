import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import {Button, Confirm, Icon } from 'semantic-ui-react';
import React, { useState } from 'react';

export default function DeleteButton ({ postID, commentID }){
    const [confirmDel, setConfirmDel] = useState(false);

    const mutation = commentID ? deleteCommentQL : deletePostQL;

    const [deletePostOrComment] = useMutation(mutation,{
        update(proxy, result) {
            setConfirmDel(false);
            // remove post from cache
        },
        variables: {
            postID,
            commentID
        }
    })
    return (
        <>
            <Button as="div" floated='right' onClick= {{deletePostOrComment}}>
                <Icon name="trash" />
                    Delete
            </Button>
            <Confirm
                open={confirmDel}
                onCancel={()=>setConfirmDel(false)}
                onConfirm={deletePostOrComment}
            />
        </>
)
}

const deletePostQL = gql`
    mutation deletePost($postID: ID!){
        deletePost(postID: $postID)
    }
`;

const deleteCommentQL = gql`
    mutation deleteComment($postID: ID!, $commentID: ID!){
        deleteComment(postID: $postID, commentID: $commentID){
            id 
            comments{
                id username datePosted contains
            }
            commCount
        }
    }
`
