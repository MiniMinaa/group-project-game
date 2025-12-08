import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

function Login({ setIsLogin}) {

    const initialUsername = localStorage.getItem('userUsername') || '';
    const initialPassword = localStorage.getItem('userPassword') || '';

    const [username, setUsername] = useState(initialUsername);
    const [password, setPassword] = useState(initialPassword);

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const clearList = () => {
        setUsername('');
        setPassword('');
    }; // almost the same as in Auth.jsx, but does not clear localStorage

    const logIn = () => {
        setErrorMessage("");

        const registeredUsername = localStorage.getItem('userUsername');
        const registeredPassword = localStorage.getItem('userPassword');

        if (!username || !password) {
            setErrorMessage("Username and password are required");
            return;
        }

        if (!registeredUsername) {
            setErrorMessage("No registered account found. Please register first.");
            return;
        }

        if (username === registeredUsername && password === registeredPassword) {
            setErrorMessage("Login successful!");
            navigate('/home');
        } else {
            setErrorMessage("Invalid username or password.");
        }
    };

    return (

        <div className="login-page">
            <h1 className="title">Login</h1>
            <p>Enter your username and password</p>

            <div className="login-form">

                <div className="inputs">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="margin-b" />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" />
                </div>

                <div className="buttons">
                    <button onClick={logIn} className="margin-b">Log in</button>
                    <button onClick={clearList}>Clear</button>
                </div>

                {errorMessage && (
                    <p style={{
                        color: errorMessage.includes("successful") ? "green" : "red",
                        marginTop: "10px"
                    }}>
                        {errorMessage}
                    </p>
                )}

            </div>

        </div>

    );
};

export default Login;