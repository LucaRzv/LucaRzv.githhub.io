import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from '@apollo/client';
import { createHttpLink } from '@apollo/client';
import {ApolloProvider} from '@apollo/client';
import React from 'react';
import { setContext } from 'apollo-link-context';

import App from './App'

// connect apollo server with apollo client
const httpLink = createHttpLink({
    uri: 'http://localhost:3001/'
})

// get token from local storage to authorize user to post
const setAuthorizationLink = setContext(() => {
    const token = localStorage.getItem('token');
    // set it as authorization header if it exists
    return {
        headers: {
            Authorization : token ? `UserToken ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    // add token to the request
    link: setAuthorizationLink.concat(httpLink),
    // store any cached data
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)