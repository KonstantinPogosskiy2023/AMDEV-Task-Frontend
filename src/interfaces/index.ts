export interface LoginAndRegistrationInterface {
  email: string;
  password: string;
}

export interface ReservationInterface {
  id: number;
  user_id: number;
  parking_spot_number: number;
  reserved_date: string;
  reserved_time: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpInterface {
  token: string;
  user_id: string;
}

export interface SpotInterface {
  id: number;
  location: string;
}
