import { ENV } from "@/src/config/env";
import axios from "axios";


export const api = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});


export const apiToken = axios.create({
    baseURL: ENV.API_URL_TOKEN,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: false,
});