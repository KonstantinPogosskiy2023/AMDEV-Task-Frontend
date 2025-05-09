import api from './axiosInstance';
import { ReservationInterface } from "../interfaces";

const historyService = {
  getMyReservationHistory: async (id: number): Promise<ReservationInterface[]> => {
    const { data } = await api.get<ReservationInterface[]>(`/history/${id}`);
    return data;
  },
};

export default historyService;
