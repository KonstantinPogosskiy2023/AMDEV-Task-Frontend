import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login', { replace: true });
    localStorage.removeItem('token');
  };

  return (
    <Box textAlign="start">
      <IconButton
        onClick={handleLogout}
        sx={{
          top: 10,
          left: 10,
          zIndex: 1,
          color: 'primary.main',
        }}
      >
        <LogoutIcon />
      </IconButton>
    </Box>
  );
};

export default LogoutButton;
