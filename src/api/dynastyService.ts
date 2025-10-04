import { api } from "@/src/api/axiosClient";
import AsyncStorage from '@react-native-async-storage/async-storage';



export const dynastyService = {
    // Get dynasty/character detail
    async getDynastyDetail(characterId: string) {
        try {
            const response = await api.get(`/api/v1/content/characters/${characterId}`, {
                headers: {
                    'Accept': 'application/json',
                },
            }
            );
            console.log('Dynasty Detailsssssssssssss API response:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching dynasty detail:', error.response || error.message);
            throw error;
        }
    },

    async getDynasties() {
        try {
            const response = await api.get("/api/v1/content/dynasties", {
                headers: {
                    'Accept': 'application/json',
                },
            }
            );
            console.log('Dynasties API response:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching dynasty detail:', error.response || error.message);
            throw error;
        }
    },

    async getEras() {
        try {
            const response = await api.get("/api/v1/content/eras", {
                headers: {
                    'Accept': 'application/json',
                },
            }
            );
            console.log('Eras API response:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching dynasty detail:', error.response || error.message);
            throw error;
        }
    },


    // Get quiz data for character
    async getCharacterQuiz(characterId: string) {
        try {
            const response = await api.get(`/api/v1/content/characters/${characterId}/lessons`, {
                headers: {
                    'Accept': 'application/json',
                },
            }
            );
            console.log('Characterttttttttt Quiz API response:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching character quiz:', error.response || error.message);
            throw error;
        }
    },


    async validateLessonAnswer(lesson_id: string, question_id: string, answer: string) {
        try {

            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
            console.log('responseTkenvalidateLessonAnswer', token);

            const response = await api.post("/api/v1/content/lessons/questions/answer", {
                lesson_id,
                question_id,
                answer,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                },
            });

            console.log("lesson_idvalidateLessonAnswer", response);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },


    async lose() {
        try {

            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
            console.log('losetoken', token);

            const response = await api.post("/api/v1/user/hearts/lose", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                },
            });
            console.log("lose", response);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },
};