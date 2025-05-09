import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  CircularProgress,
  Box, IconButton
} from '@mui/material';
import historyService from '../api/historyService';
import api from "../api/axiosInstance";
import { useSnackbar } from "notistack";
import { ReservationInterface } from "../interfaces";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [reservations, setReservations] = useState<ReservationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        if (!token) enqueueSnackbar('Пожалуйста, зарегистрируйтесь', { variant: 'error' });

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (!user_id) return;

        const response = await historyService.getMyReservationHistory(+user_id);
        setReservations(response);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        boxShadow: 3,
        borderRadius: 2,
        height: '100vh'
      }}
    >
      <Box
        textAlign="center"
        sx={{
          backgroundColor: '#172c79',
          padding: 3,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          width: '100%',
        }}
      >
        <Box textAlign="start" sx={{ width: '90px' }}>
          <IconButton
            onClick={() => navigate('/dashboard')}
            sx={{
              top: 10,
              left: 10,
              zIndex: 1,
              color: 'primary.main',
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Typography variant="h2" gutterBottom sx={{ color: '#fafafa' }}>
          PARKING
        </Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>
          История бронирований
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Номер места</strong></TableCell>
                <TableCell><strong>Дата</strong></TableCell>
                <TableCell><strong>Время</strong></TableCell>
                <TableCell><strong>Статус</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>{`A-0${res.parking_spot_number}`}</TableCell>
                  <TableCell>{res.reserved_date}</TableCell>
                  <TableCell>{res.reserved_time}</TableCell>
                  <TableCell>{res.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default HistoryPage;
