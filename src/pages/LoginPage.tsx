import { Box, Button, Container, TextField, Typography, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from "react";
import authService from "../api/authService";
import { useSnackbar } from "notistack";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async () => {
    setErrors([]);

    try {
      const user = await authService.signIn({ email, password });
      enqueueSnackbar('Вы успешно вошли', { variant: 'success' });
      localStorage.setItem('token', user.token);
      localStorage.setItem('user_id', user.user_id);
      navigate('/dashboard',  { replace: true });
    } catch (error: any) {
      if (Array.isArray(error.response?.data?.message)) {
        setErrors(error.response.data.message);
      } else if (typeof error.response?.data?.message === 'string') {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Unknown error occurred']);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      {errors.map((msg, index) => (
        <Typography color="error" key={index}>
          {msg}
        </Typography>
      ))}
      <Box mt={8} textAlign="center">
        <Box mt={3}>
        <Typography variant="h4" gutterBottom>
          PARKING
        </Typography>
        </Box>
        <Tabs value={0} onChange={() => navigate('/register')} centered>
          <Tab label="Login" />
          <Tab label="Registration" />
        </Tabs>
        <Box mt={3}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
