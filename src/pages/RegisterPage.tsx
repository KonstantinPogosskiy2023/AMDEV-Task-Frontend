import { Box, Button, Container, TextField, Typography, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from "react";
import { useState } from 'react';
import authService from "../api/authService";
import { useSnackbar } from "notistack";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setErrors([]);
    try {
      await authService.signUp({ email, password });
      enqueueSnackbar('Регистрация прошла успешно', { variant: 'success' });
      navigate('/login');
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
        <Typography variant="h4" gutterBottom>
          PARKING
        </Typography>
        <Tabs value={1} onChange={() => navigate('/login')} centered>
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
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
