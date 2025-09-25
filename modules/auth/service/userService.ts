import { ENV } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


export interface HeartsPayload {

}

export interface InitProfilePayload {
    birthYear: number;
}


export const userService = {
    async hearts(data?: HeartsPayload) {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
            console.log('responseTken', token);

            const response = await axios.get(`${ENV.API_URL}/api/v1/user/hearts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                params: data || {}, // nếu API có query params
            })
            console.log('response', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching hearts:', error.response || error.message);
            throw error;
        }
    },

    // User profile
    async userProfilee(data?: HeartsPayload) {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
            console.log('responseTken', token);

            const response = await axios.get(`${ENV.API_URL}/api/v1/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                params: data || {}, // nếu API có query params
            })
            console.log('response', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching hearts:', error.response || error.message);
            throw error;
        }
    },

    // Stats User
    async StatsUser(data?: HeartsPayload) {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${ENV.API_URL}/api/v1/user/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                params: data || {}, // nếu API có query params
            })
            console.log('response', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching hearts:', error.response || error.message);
            throw error;
        }
    },

    async Addhearts(data?: HeartsPayload) {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            const payloads = {

                "amount": 3,
                "source": "ad",
            }
            const response = await axios.post(`${ENV.API_URL}/api/v1/user/hearts/add`, payloads, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                },
            })
            console.log('response', response);
            alert("Bạn đã nhận được 1 tim ❤️")
            return response.data;
        } catch (error: any) {
            console.log('Error fetching hearts:', error.response || error.message);
            throw error;
        }
    },

    async initProfile(data?: InitProfilePayload) {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            const payloads = {

                "birth_year": data?.birthYear

            }
            const response = await axios.post(`${ENV.API_URL}/api/v1/user/initialize`, payloads, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                },
            })
            return response.data;
        } catch (error: any) {
            console.log('Error fetching initProfile:', error.response || error.message);
            throw error;
        }
    },
}