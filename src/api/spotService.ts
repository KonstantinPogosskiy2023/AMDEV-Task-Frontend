import api from './axiosInstance';
import { SpotInterface } from "../interfaces";

const spotService = {
  getOccupiedDate: async (id: number): Promise<string[]> => {
    const {data} = await api.get<string[]>(`/parking-spots/occupied/${id}`);
    return data;
  },
  getAvailableTimeSlots: async (id: number | string, date: string): Promise<string[]> => {
    const {data} = await api.get<string[]>(`/parking-spots/${id}/available-times`, {
      params: { date },
    });
    return data;
  },
  getAllParkingSpots: async (): Promise<SpotInterface[]> => {
    const {data} = await api.get<SpotInterface[]>('/parking-spots');
    return data;
  },
};

export default spotService;
