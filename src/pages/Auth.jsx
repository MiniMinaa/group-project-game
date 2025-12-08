import React, { useState, useEffect } from "react";
import Login from "../components/Login.jsx";
import "../Auth.css";

function AuthPage() {

    const [isLogin, setIsLogin] = useState(false); // login state variable

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const validatePassword = (pwd) => {
        if (pwd.length < 8) {
            return "Password must be at least 8 characters long";
        }
        return ""; // empty string = no error
    };

    const addUser = () => {
        setErrorMessage("");

        if (!username || !password) {
            setErrorMessage("Username and password are required");
            return;
        }

        const validationError = validatePassword(password);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        localStorage.setItem('userUsername', username);
        localStorage.setItem('userPassword', password);

        setErrorMessage("Registration successful! You can now log in.");
        setIsLogin(true);
    };

    const clearList = () => {
        setUsername('');
        setPassword('');
        if (!isLogin) {
            localStorage.removeItem("userUsername");
            localStorage.removeItem("userPassword");
        }
    };

    if (isLogin) {
        return (
            <div>
                <Login setIsLogin={setIsLogin} /> {/* pass setIsLogin as a prop */}
                <div className="switch-reg-box">
                    <p className="switch-reg-p">
                        Don't have an account?{" "}
                        <button type="button" onClick={() => setIsLogin(false)} className="switch-reg-btn">
                            Register
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <h1 className="title">Register an account</h1>
            <br />

            <div className="auth-content">

                <div className="reg-form">

                    <div className="inputs">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="input" />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="input" />
                    </div>

                    <div className="buttons">
                        <button onClick={addUser} className="btn">Register</button>
                        <button onClick={clearList} className="btn">Clear</button>
                    </div>

                    {errorMessage && (
                        <p style={{
                            color: errorMessage.includes("successful") ? "green" : "red",
                            marginTop: "10px"
                        }}>
                            {errorMessage}
                        </p>
                    )} {/* Not sure if this is needed */}


                </div>

                <div className="switch-box">
                    <p className="switch-login-p">
                        Already have an account?{" "}
                        <button type="button" onClick={() => setIsLogin(true)} className="btn log-in">
                            Log in
                        </button>
                    </p>
                </div>

            </div>

        </div>
    );
}

export default AuthPage;