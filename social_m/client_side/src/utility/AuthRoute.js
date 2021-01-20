// redirect to home page if logged in

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/authentification'

export default function AuthRoute({ component: Component, ...args }) {
    // if we have the user
    const context = useContext(AuthContext);
    
    // if we have the user redirect else act normal
    return (
        <Route
            {...args}
            render = {props=>
                context.user? <Redirect to='/home'/> : <Component {...props}/>
                }
        />
    )
}