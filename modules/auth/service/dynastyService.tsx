import { ENV } from "@/config/env";
import axios from "axios";

export interface DynastyDetailPayload {
    characterId: string;
}


export const dynastyService = {
    // Get dynasty/character detail
    async getDynastyDetail(characterId: string) {
        try {
            const response = await axios.get(`${ENV.API_URL}/api/v1/content/characters/${characterId}`, {
                headers: {
                    'Accept': 'application/json',
                },
            }
            );
            console.log('Dynasty Detail API response:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching dynasty detail:', error.response || error.message);
            throw error;
        }
    },

    // Get quiz data for character
    async getCharacterQuiz(characterId: string) {
        try {
            const response = await axios.get(`${ENV.API_URL}/api/v1/content/characters/${characterId}/lessons`, {
                headers: {
                    'Accept': 'application/json',
                },
            }
            );
            console.log('Character Quiz API response:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching character quiz:', error.response || error.message);
            throw error;
        }
    }
};