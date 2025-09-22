import { ENV } from "@/config/env";
import { User } from "@/modules/auth/store/authSlice";
import axios from "axios";


export interface RegisterPayload {
    email: string;
    password: string;
}

export interface LoginPayLoad {
    email: string;
    password: string;
}

export const authService = {
    async register(data: RegisterPayload): Promise<User> {
        try {
            console.log(ENV.API_URL);
            const payload = {
                email: data.email,
                password: data.password,
            };

            const response = await axios.post(`${ENV.API_URL}/api/v1/register`, payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            console.log(response);
            return response.data as User;
        } catch (error: any) {
            const data = error.response?.data;
            console.error("Register error:", data || error.message);
            throw error;
        }
    },

    async login(data: LoginPayLoad): Promise<User> {
        try {
            console.log(ENV.API_URL);
            const payload = {
                email: data.email,
                password: data.password,
            };

            const response = await axios.post(`${ENV.API_URL}/api/v1/login`, payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            console.log(response);
            return response.data as User;
        } catch (error: any) {
            const data = error.response?.data;
            console.error("Login error:", data || error.message);
            throw error;
        }

    },
}