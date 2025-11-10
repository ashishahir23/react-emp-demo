import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import isValidUser from "../../services/LoginService";
import { getDateString } from "../../utils/DateFormatter";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('demo');
    const [password, setPassword] = useState(`demo@${getDateString()}`);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic validation
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);

        // Simulate a login success/failure
        if (isValidUser(username, password)) {

            // set user context
            login({ name: username });

            // wait for some seconds to display login progressbar
            setTimeout(() => {
                setLoading(false);
                navigate("../employee/list");
            }, 1500);
        } else {
            setError('Invalid username or password.');
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && username.trim() && password.trim()) {
            e.preventDefault();
            handleLogin(e);
        }
    };

    return (
        <Box
            sx={{
                width: 350,
                margin: "80px auto",
                padding: 4,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "white",
            }}
            onKeyDown={handleKeyDown}
        >
            <Typography variant="h5" align="center" mb={3} color="primary" fontWeight={600}>
                Login
            </Typography>

            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                autoComplete="username"
            />

            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                autoComplete="current-password"
            />
            {error && <p className="error-message">{error}</p>}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                autoFocus
                startIcon={!loading && <LoginIcon />}
                sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    height: 45,
                }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
        </Box>
    );
};

export default LoginForm;