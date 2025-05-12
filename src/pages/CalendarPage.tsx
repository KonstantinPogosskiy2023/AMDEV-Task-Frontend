import React, {useEffect, useState} from 'react';
import {
  Container,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from '@mui/material';
import Cross from "../components/Cross";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from "../api/axiosInstance";
import Calendar from 'react-calendar';
import reservationService from "../api/reservationService";
import spotService from "../api/spotService";
import 'react-calendar/dist/Calendar.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { TIME_SLOTS, BOOKED } from '../constants';
import { dateFormatting } from "../utils";
import { useSnackbar } from "notistack";
import { ReservationInterface } from "../interfaces";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [reservationsForDate, setReservationsForDate] = useState<ReservationInterface[]>([]);
  const [isDayAvailable, setIsDayAvailable] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const { spot } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const occupiedDates = await spotService.getOccupiedDate(spot.id);
        setIsDayAvailable(occupiedDates);
      } catch (error) {
        console.error('Error while parking-spots loading', error);
      }
    };
    fetchData();
  }, [dialogOpen, spot.id]);

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);

    try {
      const formattedDate = dateFormatting(date)
      if (!token) return enqueueSnackbar('Мы вас не нашли. Пожалуйста, зарегистрируйтесь.', { variant: 'error' });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const reservations = await reservationService.getReservations({
        data: {
          user_id,
          parking_spot_number: id,
          reserved_date: formattedDate
        }
      })
      setReservationsForDate(reservations);

      if (!id) return;

      const response = await spotService.getAvailableTimeSlots(id, formattedDate);
      setAvailableSlots(response);

    } catch (error) {
      console.error('Error when getting time-slots:', error);
      setAvailableSlots([]);
    }
  };
  const handleSlotClick = async (slot: string) => {
    if (!selectedDate) return;

    const reserved_date = dateFormatting(selectedDate);

    const reservationData = {
      user_id: localStorage.getItem('user_id'),
      parking_spot_number: id,
      reserved_date,
      reserved_time: slot,
      status: BOOKED,
    };

    try {
      await reservationService.createReservation(reservationData)
      setDialogOpen(false);
      enqueueSnackbar(`Вы успешно забронировали место на ${slot} на ${selectedDate.toLocaleDateString('ru-RU')}`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Ошибка при бронировании, попробуйте снова', { variant: 'error' });
    }
  };

  const handleCancelReservation = async (slot: string) => {
    if (!selectedDate) return;

    const reserved_date = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    const reservationToCancel = reservationsForDate.find(
      (reservation) => reservation.reserved_time === slot && reservation.reserved_date === reserved_date
    );

    if (!reservationToCancel) {
      enqueueSnackbar('Бронь не найдена>', {variant: 'error'});
      return;
    }

    try {
      await reservationService.cancelReservation(reservationToCancel.id);
      await handleDateClick(selectedDate);
      enqueueSnackbar('Бронь отменена', { variant: 'success' });
    } catch (error) {
      console.error('Cancellation error', error);
      enqueueSnackbar('Ошибка при отмене бронирования, попробуйте снова', { variant: 'error' });
    }
  };

  const isSlotBookedByMe = (slot: string) => {
    return reservationsForDate.some(
      (reservation) => reservation.reserved_time === slot && reservation.user_id === Number(user_id)
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignItems: 'center',
        boxShadow: 3,
        borderRadius: 2,
        height: '100vh'
      }}
    >
      <Box textAlign="center"
           sx={{
             backgroundColor: '#172c79',
             padding: 3,
             borderTopLeftRadius: 8,
             borderTopRightRadius: 8,
             width: '100%',
           }}
      >
        <Box textAlign="start">
          <IconButton
            onClick={() => navigate(-1)}
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
      <Box display="flex" flexDirection="column">
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Бронирование места A-0{spot.id}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: '#a5a4a4' }}>
            {spot.location}
          </Typography>
        </Box>

        <Box mb={3}>
          <Calendar
            locale="ru-RU"
            onClickDay={handleDateClick}
            tileDisabled={({ date }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              date.setHours(0, 0, 0, 0);
              return date < today;
            }}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dateString = dateFormatting(date)

                if (isDayAvailable.includes(dateString)) {
                  return <Cross/>
                }
              }
              return null;
            }}
          />
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            Доступные слоты на {selectedDate?.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
          })} ({selectedDate?.toLocaleDateString('ru-RU', {
            weekday: 'short'
          })}):
          </DialogTitle>
          <DialogContent>
            <List>
              {TIME_SLOTS.map((slot) => {
                const isAvailable = availableSlots.includes(slot);
                const isBookedByMe = isSlotBookedByMe(slot);

                return (
                  <ListItem key={slot}>

                      <ListItemText
                        primary={slot}
                        primaryTypographyProps={{
                          color: isAvailable ? 'textPrimary' : 'textSecondary',
                          style: isAvailable ? {} : { textDecoration: 'line-through' },
                        }}
                      />

                    {isAvailable ? (
                      <ListItemButton
                        onClick={() => handleSlotClick(slot)}
                        sx={{
                          ml: 2,
                          backgroundColor: 'green',
                          color: 'white',
                          borderRadius: 1,
                          px: 2,
                          '&:hover': { backgroundColor: '#388e3c' },
                        }}
                      >
                        Выбрать
                      </ListItemButton>
                    ) : isBookedByMe ? (
                      <ListItemButton
                        onClick={() => handleCancelReservation(slot)}
                        sx={{
                          ml: 2,
                          backgroundColor: 'red',
                          color: 'white',
                          borderRadius: 1,
                          px: 2,
                          '&:hover': { backgroundColor: '#388e3c' },
                        }}
                      >
                        Отменить
                      </ListItemButton>
                    ) : (
                      <ListItemButton sx={{ backgroundColor: '#d9d7d7', color: '#b1b1b1', borderRadius: 1, px: 2 }}>
                        Занято
                      </ListItemButton>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
}
