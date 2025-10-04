// import { api, apiToken } from "@/src/api/axiosClient";
// import { User } from "@/src/redux/slices/authSlice";
// import { API_URL } from "@env";
// import axios from "axios";


// export interface RegisterPayload {
//     username: string;
//     email: string;
//     age: number;
//     password: string;
// }

// export interface LoginPayLoad {
//     username: string;
//     password: string;
// }

// export interface ForgotPasswordPayLoad {
//     email: string;
// }

// export interface ForgotPasswordPayLoadCode {
//     flowId: string;
//     code: string;
// }

// export interface ForgotPasswordPayLoadPassword {
//     password: string;
//     flowIdforgotpassword: string,
//     sessionToken: string
// }

// export interface ForgotPasswordOTPResponse {
//     valid: boolean;   // OTP hợp lệ hay không
//     user?: User;      // Thông tin user nếu cần
// }


// // API register
// export const authService = {
//     async register(data: RegisterPayload): Promise<User> {
//         // láy flow ID
//         const response = await api.get("/self-service/registration/api");

//         const URLflowId = response.data.ui.action;
//         if (!URLflowId) throw new Error("Failed to get registration flow ID");

//         console.log("Registration flow ID:", URLflowId);
//         try {
//             const payload = {
//                 method: "password",
//                 traits: {
//                     email: data.email,
//                     username: data.username,
//                     age: Number(data.age),
//                 },
//                 password: data.password,
//             };
//             console.log("Payload gửi:", payload);
//             // gửi dữ liệu đăng ký
//             const res = await axios.post(URLflowId, payload, {
//                 withCredentials: true,
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                 },
//             });

//             console.log("Phản hồi từ server:", res);
//             return res.data as User;
//         } catch (error: any) {
//             const data = error.response?.data;
//             if (data?.ui?.messages?.length) {
//                 data.ui.messages.forEach((msg: any) => console.error("Kratos message:", msg.text));
//             } else {
//                 console.error("Register error:", data || error.message);
//             }
//             throw error;
//         }
//     },


//     // API login
//     async login(data: LoginPayLoad): Promise<User> {
//         // láy flow ID
//         console.log(API_URL)
//         const response = await api.get("/self-service/login/api");
//         const URLflowId = response.data.ui.action;
//         if (!URLflowId) throw new Error("Failed to get registration flow ID");

//         try {
//             const payload = {
//                 method: "password",
//                 identifier: data.username,
//                 password: data.password,
//             };
//             console.log("Payload gửi:", payload);
//             // gửi dữ liệu đăng ký
//             const res = await axios.post(URLflowId, payload, {
//                 withCredentials: false,
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                 },
//             });

//             console.log("Phản hồi từ server:", res.data.session_token);
//             const payloadToken = {
//                 session_token: res.data.session_token,
//             };
//             const resEnd = await apiToken.post("/api/v1/auth/login", payloadToken);
//             console.log(resEnd.data)
//             return resEnd.data;
//         } catch (error: any) {
//             const data = error.response?.data;
//             if (data?.ui?.messages?.length) {
//                 data.ui.messages.forEach((msg: any) => console.error("Kratos message:", msg.text));
//             } else {
//                 console.error("Register error:", data || error.message);
//             }
//             throw error;
//         }

//     },

//     // API ForgotPassword - send email
//     async forgotpassword(data: ForgotPasswordPayLoad,): Promise<{ flowId: string }> {

//         const response = await api.get("/self-service/recovery/api")

//         console.log("Flow ID:", response);

//         const URL_FlowID = response.data.ui.action;

//         try {
//             const payload = {
//                 "method": "code",
//                 "email": data.email
//             }

//             const res = await axios.post(URL_FlowID, payload, {
//                 withCredentials: false,
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             })

//             console.log("URL_Post : ", res);

//             return { flowId: URL_FlowID }
//         } catch (error: any) {
//             const data = error.response?.data;
//             if (data?.ui?.message?.length) {
//                 data.ui.message.forEach((msg: any) => console.error("Kratos message:", msg.text))
//             }
//             else {
//                 console.error("Register error:", data || error.message);
//             }
//             throw error;
//         }

//     },

//     // API ForgotPassword - OTP
//     async forgotpasswordOTP(data: ForgotPasswordPayLoadCode): Promise<{ flowIdforgotpassword: string, sessionToken: string }> {
//         try {
//             const payloadOTP = {
//                 "method": "code",
//                 "code": data.code
//             }

//             const resOTP = await axios.post(data.flowId, payloadOTP, {
//                 withCredentials: false,
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             })

//             console.log("Response OTP token : ", resOTP);

//             // Lấy từ sessionToken continue_with
//             const sessionToken = resOTP.data.continue_with?.find((c: any) => c.action === "set_ory_session_token")?.ory_session_token;
//             const flowId = resOTP.data.continue_with?.find((c: any) => c.action === "show_settings_ui")?.flow?.id;

//             if (!sessionToken || !flowId) {
//                 throw new Error("Không tìm thấy sessionToken hoặc flowId trong response");
//             }
//             return { flowIdforgotpassword: flowId, sessionToken };
//         } catch (error: any) {
//             const data = error.response?.data;
//             if (data?.ui?.message?.length) {
//                 data.ui.message.forEach((msg: any) => console.error("Kratos message:", msg.text))
//             }
//             else {
//                 console.error("Register error:", data || error.message);
//             }
//             throw error;
//         }

//     },

//     // API ForgotPassword - new password
//     async forgotpasswordOTPPassword(data: ForgotPasswordPayLoadPassword): Promise<ForgotPasswordOTPResponse> {
//         try {
//             const payloadPassword = {
//                 "method": "password",
//                 "password": data.password
//             }

//             const responsePassword = await api.post(`/self-service/settings?flow=${data.flowIdforgotpassword}`, payloadPassword, {
//                 withCredentials: false,
//                 headers: {
//                     "X-Session-Token": data.sessionToken,
//                     "Content-Type": "application/json"
//                 }
//             })
//             return { valid: true, user: responsePassword.data.identity };
//         } catch (error: any) {
//             const data = error.response?.data;
//             if (data?.ui?.message?.length) {
//                 data.ui.message.forEach((msg: any) => console.error("Kratos message:", msg.text))
//             }
//             else {
//                 console.error("Register error:", data || error.message);
//             }
//             throw error;
//         }
//     }
// }



import { ENV } from "@/src/config/env";
import { LoginResponse, User } from "@/src/redux/slices/authSlice";
import { LoginPayLoad, RegisterPayload } from "@/src/types/authTypes";
import axios from "axios";
import { api } from "./axiosClient";


export const authService = {
    async register(data: RegisterPayload): Promise<User> {
        try {
            console.log("daaaa", ENV.API_URL);
            const payload = {
                username: data.username,
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

    async login(data: LoginPayLoad): Promise<LoginResponse> {
        try {
           console.log("daaađâhdhjdnaa", ENV.API_URL);
            const payload = {
                email_or_username: data.email,
                password: data.password,
            };

            const response = await api.post("/api/v1/login", payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            console.log(response);
            const parsed = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
            console.log('token', parsed);

            return parsed.data as LoginResponse; // kiểu đúng
        } catch (error: any) {
            const data = error.response?.data;
            console.error("Login error:", data || error.message);
            throw error;
        }

    },
}