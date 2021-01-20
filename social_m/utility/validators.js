// object to store errors and get them to the frontend

module.exports.validateRegisterInput  = (
    username,
    email,
    password,
    confirmPassword
) => {
    const validationErrors = {};

    if (username.trim() === "") {
        validationErrors.username = "Empty username field!";
    }

    if (email.trim() === "") {
        validationErrors.email = "Empty email field!";
    }
    else {
        //confirm it's an email
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email.match(emailRegex)) {
            validationErrors.email = "Not a valid email address!"
        }
    }

    if (password.trim() === "") {
        validationErrors.password = "Empty password field!";
    }


    //problem with matching passwords
    // else if(password !== confirmPassword) {
    //     validationErrors.confirmPassword = "Passwords must match!"
    // }

    return {
        validationErrors,

        // if there is no error continue
        isValid: Object.keys(validationErrors).length < 1
    }
}

module.exports.validateLoginInput = (
    email,
    password
) => {
    const loginValidationErrors = {};

    if (email.trim() === "") {
        loginValidationErrors.email = "Empty email field!";
    }
    else {
        //confirm it's an email
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email.match(emailRegex)) {
            loginValidationErrors.email = "Not a valid email address!"
        }
    }

    if (password.trim() === "") {
        loginValidationErrors.password = "Empty password field!";
    }

    if(!email && !password) {
        loginValidationErrors.logError = 'Check your credentials again!'
    }

    return {
        loginValidationErrors,
        logIsValid: Object.keys(loginValidationErrors).length < 1
    }
}