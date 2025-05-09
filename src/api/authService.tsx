import api from './axiosInstance';
import { SignUpInterface, LoginAndRegistrationInterface } from "../interfaces";

const authService = {
  signUp: async (dto: LoginAndRegistrationInterface): Promise<SignUpInterface> => {
    const { data } = await api.post<SignUpInterface>('/auth/register', dto);
    return data;
  },

  signIn: async (dto: LoginAndRegistrationInterface): Promise<SignUpInterface> => {
    const { data } = await api.post<SignUpInterface>('/auth/login', dto);
    return data;
  },
};

export default authService;
