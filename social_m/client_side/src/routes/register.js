import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client'

import { AuthContext } from '../context/authentification'

export default function Register(props) {
    const context = useContext(AuthContext)

    const [data, setData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPass: ''
    })

    const [errors, setErrors] = useState({
    })
    
    // using hooks to change data values with input ones
    const onChange = (event) => {
        setData({
            ...data, [event.target.name]: event.target.value
        })
    }

    const [addUser, { loading }] = useMutation(registerUser, {
        //if mutation is successful this will be triggered
        update(proxy, result){
            // call login function from context and pass it user data
            context.login(result.data.register)
            // redirect to homepage
            props.history.push('/home')
            console.log(result.data.register);
        },
        // get errors written on back end
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.validationErrors)
        },
        variables: {
            username: data.username,
            email: data.email,
            password: data.password,
            confirmPass: data.confirmPass
        }
    })


    const onSubmit = (event) => {
        // don't restart page when submit
        event.preventDefault();
        // send mutation to server
        addUser();  
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
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1 style={title_style}>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Enter username"
                    name="username"
                    value={data.username}
                    onChange={onChange}
                    type='text'
                    error={errors.username ? true : false}
                />
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
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm password"
                    name="confirmPass"
                    value={data.confirmPass}
                    onChange={onChange}
                    type='password'
                    error={errors.confirmPass ? true : false}
                />
                <Form.Checkbox label='I agree to the Terms and Conditions' />
                <Button type='submit'>Submit</Button>
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

// take data from input, trigger register mutation from apollo, and get back some data
const registerUser = gql`
    mutation register(
        $username: String!,
        $email: String!,
        $password: String!,
        $confirmPass: String!
    ) {
        register(
            registerInput: {
                username: $username,
                email: $email,
                password: $password,
                confirm_pass: $confirmPass,
            }
        ) {
            id
            email
            username
            dateCreated
            token
        }
    }
`