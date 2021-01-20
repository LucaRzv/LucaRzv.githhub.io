import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client'

export default function PostComp() {
    const [data, setData] = useState({
        contains: ''
    })

    const [createPost, { error }] = useMutation(writePost, {
        update(proxy, result){
            // use query to get client data stored in the cache
            const cachedData = proxy.readQuery({
                query: getPostsQuery
            })
            // update posts and put the latest at top, spread the rest
            proxy.writeQuery({ query: getPostsQuery, 
                                data: {
                                        getPosts:[result.data.createPost, ...cachedData.getPosts]
            }
        });
            // reset field
            data.contains = '';
        },
        onError(err){
            return err
        },
        variables: {...data}
    })

    const onChange = (event) => {
        setData({
            ...data, [event.target.name]: event.target.value
        })
    }

    const postSubmit = (event) => {
        event.preventDefault();
        createPost();
    }

    const form_style = {
        width:'60%',
        marginLeft: 'auto',
        marginRight: 'auto'
    }

    return (
        <>
            <Form onSubmit={postSubmit} style={form_style}>
            {/* <h2>Your thoughts</h2> */}
                <Form.Field>
                    <Form.Input placeholder="Your thoughts here..." name="contains" onChange={onChange} value={data.contains}
                        error={ error ? true : false}
                    />
                    <Button type="submit">Post</Button>
                </Form.Field>
            </Form>
            {error && <div className="ui error message" style={form_style}>
                <ul className="list" >
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>}
        </>
    )
}

const writePost = gql`
    mutation createPost(
        $contains: String!
    ){
        createPost(
            contains: $contains
        )
        {
            id username contains datePosted
            comments{
                id datePosted username contains
            }
            likes{
                id username dateLiked
            }
            likeCount commCount
        }
    }
`

const getPostsQuery = gql `
    {
        getPosts {
            id
            contains
            username
            datePosted
            likeCount
            likes {
                username
            }
            commCount
            comments {
                id
                username
                contains
                datePosted
            }
        }   
    }
`