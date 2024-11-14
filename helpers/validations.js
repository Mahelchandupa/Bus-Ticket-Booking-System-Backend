const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const isPasswordStrong = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return re.test(password);
}

module.exports = { isValidEmail, isPasswordStrong };