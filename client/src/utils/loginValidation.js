export function validateLogin(email, password) {
    if (!email || email.trim() === "") {
        return "Email/Username is required";
    }

    if (!password || password.trim() === "") {
        return "Password is required";
    }

    return "Login successful";
}
