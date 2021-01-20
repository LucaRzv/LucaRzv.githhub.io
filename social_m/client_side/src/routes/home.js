import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Grid, Transition } from 'semantic-ui-react'

import PostDisplay from '../components/PostDisplay'
import { AuthContext } from '../context/authentification'
import PostComp from '../components/PostComp'

export default function Home() {
    const context = useContext(AuthContext);

    // data must return an empty object object if destructured to work
    const{ loading, data: { getPosts: posts } = {} } = useQuery(getPostsQuery);
    if(posts) {
        console.log(posts)
    }

    const column_styles = {
        marginBottom: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '60%'
    }

    const title_styles = {
        textAlign: 'center',
        display: 'block',
        // 1rem = 16px
        fontSize: 90,
        marginTop:15,
        marginBottom: 15,
    }

    return (
        <Grid columns={1} >
            <Grid.Row style={title_styles}>
                <h1>Latest Posts</h1>
            </Grid.Row>
            {context.user && (
                <Grid.Column>
                    <PostComp/>
                </Grid.Column>
            )}
            <Grid.Row>
                {/*display something while loading posts*/}
                { loading? (
                    <h1>Loading posts...</h1>
                ) : (
                    <Transition.Group duration={300}>
                        {
                            // iterate through posts and display them
                            posts && posts.map(post => (
                            <Grid.Column key={post.id} style={column_styles}>
                                <PostDisplay post={post}/>
                            </Grid.Column>
                    ))
                        }
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    )
}


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