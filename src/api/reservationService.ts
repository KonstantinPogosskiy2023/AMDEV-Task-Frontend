import api from './axiosInstance';
import { ReservationInterface } from "../interfaces";

const reservationService = {
  createReservation: async (props: any): Promise<ReservationInterface> => {
    const { data } = await api.post<ReservationInterface>('/reservations', props);
    return data;
  },

  getReservations: async (props: any): Promise<ReservationInterface[]> => {
    const { data } = await api.get<ReservationInterface[]>('/reservations', { ...props.params });
    return data;
  },

  cancelReservation: async (id: number) => {
    const reservations = await api.delete(`/reservations/${id}`);
    return reservations.data
  }
};

export default reservationService;
