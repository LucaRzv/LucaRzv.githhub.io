import React, { useReducer, createContext } from 'react';
import decodeToken from 'jwt-decode';
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
}

// check if token is there
if(localStorage.getItem('token')){
    // decode token to check if it expired
    const tkn = jwtDecode(localStorage.getItem('token'));  

    if (tkn.exp * 1000 < Date.now()){
        localStorage.removeItem('token');
    }
    else {
        initialState.user = tkn;
    }
}

// to not pass props from one level to another use context
const AuthContext = createContext({
    user: null,
    login : (data) => {},
    logout: () => {}
})

function authReducer(state, action) {
    switch(action.type){
        case 'login': 
            return{
                ...state,
                user: action.payload
            }
        case 'logout':
            return{
                ...state,
                user: null
            }
        default:
            return state
    }
}


function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, initialState);

    // when login call the function and change the data inside the context
    // and set the user to the user data so that the app knows it logged in
    const login = (data) => {
        // save token to local storage, when refresh it will remain
        localStorage.setItem('token', data.token);

        dispatch({
            type: 'login',
            payload: data
        })
    }

    const logout = () =>{
        localStorage.removeItem('token');

        dispatch({
            type: 'logout'
        })
    }

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                login,
                logout
            }}
            {...props}
            />
    )
}

export { AuthContext, AuthProvider };