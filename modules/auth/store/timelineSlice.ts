import { fetchTimeline } from '@/modules/auth/store/authThunks'; // Import từ authThunks
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

    return apiEras.map(era => ({
        id: era.era_id || era.id,
        name: era.era || era.name,
        period: `${era.start_year || ''} - ${era.end_year || ''}`,
        color: era.color || getRandomColor(),
        icon: era.icon || 'castle',
        completed: era.completed || false,
        isMainDynasty: true,
        description: era.description || `Giai đoạn ${era.era || era.name}`,
        subEvents: era.dynasties?.map(dynasty => ({
            id: dynasty.dynasty_id || dynasty.id,
            name: dynasty.dynasty || dynasty.name,
            period: `${dynasty.start_year || ''} - ${dynasty.end_year || ''}`,
            color: dynasty.color || era.color || getRandomColor(),
            icon: dynasty.icon || 'crown',
            completed: dynasty.completed || false,
            isSubEvent: true,
            parentId: era.era_id || era.id,
            description: dynasty.description || `Triều đại ${dynasty.dynasty || dynasty.name}`,
            characters: dynasty.characters || [], 
        })) || []
    }));
};


const getRandomColor = () => {
    const colors = ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const { setCurrentLesson, setSelectedCharacterId, clearTimelineError, resetTimeline } = timelineSlice.actions;
export default timelineSlice.reducer;