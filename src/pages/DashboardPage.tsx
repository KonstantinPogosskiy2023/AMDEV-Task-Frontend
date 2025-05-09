import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, IconButton,
} from '@mui/material';
import api from "../api/axiosInstance";
import { useNavigate } from 'react-router-dom';
import LogoutButton from "../components/Logout";
import { useSnackbar } from "notistack";
import { SpotInterface } from "../interfaces";
import HistoryIcon from '@mui/icons-material/History';

export default function DashboardPage() {
  const [parkingSpots, setParkingSpots] = useState<SpotInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleHistory = () => navigate('/history', { replace: true });

  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) enqueueSnackbar('Пожалуйста, зарегистрируйтесь', { variant: 'error' });

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get<SpotInterface[]>('/parking-spots');
        setParkingSpots(data);
      } catch (error) {
        console.error('Error while parking-spots loading', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSpots();
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
        <Box textAlign="start" sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <LogoutButton />
          <IconButton
            onClick={handleHistory}
            sx={{
              top: 10,
              left: 10,
              zIndex: 1,
              color: 'primary.main',
            }}
          >
          <HistoryIcon />
          </IconButton>
        </Box>
        <Typography variant="h2" gutterBottom sx={{ color: '#fafafa' }}>
          PARKING
        </Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="h5" gutterBottom>
          Список парковочных мест
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{backgroundColor: '#efefef'}}>
              <TableRow>
                <TableCell sx={{ maxWidth: '70px', borderRight: '1px solid #ddd' }}>
                  <strong>Парковочное место:</strong>
                </TableCell>
                <TableCell>
                  <strong>Адрес:</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parkingSpots.map((spot) => (
                <TableRow
                  key={spot.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/calendar/${spot.id}`, { state: { spot } })}
                >
                  <TableCell sx={{ maxWidth: '80px', borderRight: '1px solid #ddd' }}>
                    <strong>{`A-0${spot.id}`}</strong>
                  </TableCell>
                  <TableCell sx={{ maxWidth: '150px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {spot.location}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={3} sx={{ width: '100%', boxShadow: 3, borderRadius: 2, paddingTop: 1, paddingBottom: 1}}>
        <Typography sx={{ marginLeft: 1, marginRight: 1}} gutterBottom>Всего мест: {parkingSpots.length}</Typography>
      </Box>
    </Container>
  );
}
