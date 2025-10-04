import { fetchTimeline } from '@/src/redux/thunks/authThunks'; // Import từ authThunks
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const colors = ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444']; // danh sách màu sẵn
const usedColors: string[] = []; // màu đã dùng
const eraColors: Record<string, string> = {}; // lưu màu cố định cho từng era

export interface TimelineState {
    dynasties: any[];
    loading: boolean;
    error: string | null;
    currentLesson: number;
    selectedCharacterId?: string; // thêm dòng này
}

const initialState: TimelineState = {
    dynasties: [],
    loading: false,
    error: null,
    currentLesson: 0,
    selectedCharacterId: undefined,
};

interface ApiDynasty {
    id?: string;
    dynasty_id?: string;
    dynasty?: string;
    name?: string;
    start_year?: number;
    end_year?: number;
    color?: string;
    icon?: string;
    completed?: boolean;
    description?: string;
    characters?: any[];
}

interface ApiEra {
    era_id?: string;
    era?: string;
    id?: string;
    name?: string;
    start_year?: number;
    end_year?: number;
    color?: string;
    icon?: string;
    completed?: boolean;
    description?: string;
    dynasties?: ApiDynasty[];
}


const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        setCurrentLesson: (state, action) => {
            state.currentLesson = action.payload;
            // Lấy characterId nếu có
            const item = state.dynasties[action.payload];
            if (item?.subEvents && item.subEvents.length > 0) {
                // Lấy id của character đầu tiên của subEvent
                state.selectedCharacterId = item.subEvents[0].id || undefined;
            } else if (item?.characters && item.characters.length > 0) {
                state.selectedCharacterId = item.characters[0].id;
            } else {
                state.selectedCharacterId = undefined;
            }
        },
        setSelectedCharacterId(state, action: PayloadAction<string>) {
            state.selectedCharacterId = action.payload;
        },
        clearTimelineError: (state) => {
            state.error = null;
        },
        resetTimeline: (state) => {
            state.dynasties = [];
            state.currentLesson = 0;
            state.error = null;
        },
        updatePassedStatus: (state, action: PayloadAction<{ index: number; passed: boolean }>) => {
            const { index, passed } = action.payload;
            if (state.dynasties && state.dynasties[index]) {
                state.dynasties[index].passed = passed;
                // Tự động mở khóa bài tiếp theo nếu có
                if (passed && state.dynasties[index + 1]) {
                    state.dynasties[index + 1].completed = true; // để hiện màu nổi
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTimeline.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTimeline.fulfilled, (state, action) => {
            state.loading = false;
            console.log('Timeline API Response:', action.payload);

            // Transform API data to match component structure
            if (action.payload?.data?.eras) {
                state.dynasties = transformApiData(action.payload.data.eras);
            } else if (action.payload?.eras) {
                state.dynasties = transformApiData(action.payload.eras);
            } else if (Array.isArray(action.payload)) {
                state.dynasties = transformApiData(action.payload);
            } else {
                state.dynasties = [];
            }
        });
        builder.addCase(fetchTimeline.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Lỗi không xác định';
        });
    },
});


const transformApiData = (apiEras: ApiEra[]): any[] => {
    if (!Array.isArray(apiEras)) return [];

    return apiEras.map(era => {
        const eraName = era.era || era.name || 'Unknown Era';
        const eraColor = era.color || getEraColor(eraName); // ✅ gọi hàm, trả về string

        return {
            id: era.era_id || era.id,
            name: eraName,
            period: `${era.start_year || ''} - ${era.end_year || ''}`,
            color: eraColor, // ✅ string
            icon: era.icon || 'castle',
            completed: era.completed || false,
            isMainDynasty: true,
            description: era.description || `Giai đoạn ${eraName}`,
            subEvents: era.dynasties?.map(dynasty => ({
                id: dynasty.dynasty_id || dynasty.id,
                name: dynasty.dynasty || dynasty.name,
                period: `${dynasty.start_year || ''} - ${dynasty.end_year || ''}`,
                color: dynasty.color || eraColor, // ✅ string, không phải function
                icon: dynasty.icon || 'crown',
                completed: dynasty.completed || false,
                isSubEvent: true,
                parentId: era.era_id || era.id,
                description: dynasty.description || `Triều đại ${dynasty.dynasty || dynasty.name}`,
                characters: dynasty.characters || [],
            })) || []
        };
    });
};


const getEraColor = (eraName: string) => {
    // Nếu era đã có màu → dùng luôn
    if (eraColors[eraName]) return eraColors[eraName];

    // Lấy màu đầu tiên chưa dùng
    const availableColors = colors.filter(c => !usedColors.includes(c));
    const color = availableColors.length > 0 ? availableColors[0] : '#3B82F6'; // fallback màu xanh nếu hết

    // Lưu màu cho era và đánh dấu đã dùng
    eraColors[eraName] = color;
    usedColors.push(color);

    return color;
};

export const { setCurrentLesson, setSelectedCharacterId, clearTimelineError, resetTimeline } = timelineSlice.actions;
export default timelineSlice.reducer;