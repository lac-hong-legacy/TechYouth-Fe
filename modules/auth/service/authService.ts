import { ENV } from "@/config/env"
import axios from "axios";
import { User } from "@/modules/auth/store/authSlice";


export interface LoginPayLoad {
    username: string;
    password: string;
}


export const authService = {
    // API login
    async login(data: LoginPayLoad): Promise<User> {
        // láy flow ID
        console.log(ENV.API_URL)
        const response = await axios.get(`${ENV.API_URL}/self-service/login/api`, {
            withCredentials: true,
            headers: {
                "Accept": "application/json",
            }
        });
        const URLflowId = response.data.ui.action;
        if (!URLflowId) throw new Error("Failed to get registration flow ID");

        try {
            const payload = {
                method: "password",
                identifier: data.username,
                password: data.password,
            };
            console.log("Payload gửi:", payload);
            // gửi dữ liệu đăng ký
            const res = await axios.post(URLflowId, payload, {
                withCredentials: false,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });

            console.log("Phản hồi từ server:", res.data.session_token);
            const payloadToken = {
                session_token: res.data.session_token,
            };
            const resEnd = await axios.post(`${ENV.API_URL_TOKEN}/api/v1/auth/login`, payloadToken, {
                withCredentials: false,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
            console.log(resEnd.data)
            return resEnd.data;
        } catch (error: any) {
            const data = error.response?.data;
            if (data?.ui?.messages?.length) {
                data.ui.messages.forEach((msg: any) => console.error("Kratos message:", msg.text));
            } else {
                console.error("Register error:", data || error.message);
            }
            throw error;
        }

    },
}