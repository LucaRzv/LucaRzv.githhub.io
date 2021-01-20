import React, {useState, useContext} from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client'

import { AuthContext } from '../context/authentification'

export default function Login(props) {
    const context = useContext(AuthContext)

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({
    })
    
    // using hooks to change data values with input ones
    const onChange = (event) => {
        setData({
            ...data, [event.target.name]: event.target.value
        })
    }

    const [logUser, { loading }] = useMutation(loginUser, {
        //if mutation is successful this will be triggered
        update(proxy, result){
            // call login function from context and pass it user data
            context.login(result.data.login)
            // redirect to homepage
            props.history.push('/home')
            console.log(result.data.login);
        },
        // get errors written on back end
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.loginValidationErrors)
        },
        variables: {
            email: data.email,
            password: data.password,
        }
    })

    const onLogin = (event) => {
        // don't restart page when submit
        event.preventDefault();
        // send mutation to server
        logUser();  
    }

    const form_style = {
        width: '50%',
        margin: 'auto'
    }

    const title_style = {
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 30
    }

    return (
        <div style={form_style}>
            <Form onSubmit={onLogin} noValidate className={loading ? "loading" : ''}>
                <h1 style={title_style}>Login</h1>
                <Form.Input
                    label="Email"
                    placeholder="Enter email"
                    name="email"
                    value={data.email}
                    onChange={onChange}
                    type='email'
                    error={errors.email ? true : false}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={onChange}
                    type='password'
                    error={errors.password ? true : false}
                />
                <Button type='submit'>Login</Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className='ui error message'>
                    <ul>
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const loginUser = gql`
    mutation login(
        $email: String!,
        $password: String!
    ){
        login(
            email: $email
            password: $password
        ){
            id
            username
            email
            dateCreated
            token
        }
    }
`