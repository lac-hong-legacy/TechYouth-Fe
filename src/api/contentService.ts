import { api } from "@/src/api/axiosClient";


export interface ContentPayload {

}

export const contentService = {
    async content(data?: ContentPayload) {
        try {
            const response = await api.get("/api/v1/content/timeline", {
                headers: {
                    'Accept': 'application/json',
                },
            })
            console.log('Timeline API response:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error fetching hearts:', error.response || error.message);
            throw error;
        }
    },
}