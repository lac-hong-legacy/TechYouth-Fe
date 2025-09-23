# Guest Module

This module implements guest user functionality for the TechYouth app, allowing users to try the app without registration with limited access (2 lessons maximum).

## Features

- **Guest Session Management**: Create and manage anonymous user sessions
- **Limited Access**: Guests can access only the first 2 lessons
- **Heart System**: Manage hearts for lesson attempts
- **Local Storage**: Store guest progress locally on device
- **Progress Tracking**: Track completed lessons and unlocked characters
- **Ad Integration**: Watch ads to restore hearts

## API Endpoints Implemented

Based on the API documentation, this module implements the following endpoints:

- `POST /api/v1/guest/session` - Create or retrieve guest session
- `GET /api/v1/guest/session/{sessionId}/progress` - Get guest progress
- `GET /api/v1/guest/session/{sessionId}/lesson/{lessonId}/access` - Check lesson access
- `POST /api/v1/guest/session/{sessionId}/lesson/complete` - Complete a lesson
- `POST /api/v1/guest/session/{sessionId}/hearts/add` - Add hearts (from ads)
- `POST /api/v1/guest/session/{sessionId}/hearts/lose` - Lose a heart

## Module Structure

```
modules/guest/
├── components/
│   └── GuestModeExample.tsx    # Example component showing usage
├── hooks/
│   ├── useGuest.ts            # Main hook for guest functionality
│   └── index.ts               # Hook exports
├── service/
│   └── guestService.ts        # API service layer
├── store/
│   ├── guestSlice.ts          # Redux slice
│   └── guestThunks.ts         # Async thunks
├── types/
│   └── index.ts               # TypeScript interfaces
├── utils/
│   └── deviceUtils.ts         # Device ID and storage utilities
├── index.ts                   # Module exports
└── README.md                  # This file
```

## Usage

### 1. Basic Setup

First, ensure the guest reducer is added to your root reducer (already done):

```typescript
// modules/store/rootReducer.ts
import guestReducer from "@/modules/guest/store/guestSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    guest: guestReducer, // ✅ Added
});
```

### 2. Using the Guest Hook

```typescript
import React, { useEffect } from 'react';
import { useGuest } from '@/modules/guest';

const MyComponent = () => {
  const {
    // State
    session,
    progress,
    loading,
    error,
    isGuestMode,
    
    // Actions
    initializeGuestSession,
    completeLesson,
    checkLessonAccess,
    addHearts,
    loseHeart,
    
    // Helpers
    hasReachedGuestLimit,
    hasHearts,
    isLessonAccessible,
  } = useGuest();

  useEffect(() => {
    // Initialize guest session when component mounts
    initializeGuestSession();
  }, [initializeGuestSession]);

  const handleCompleteLesson = () => {
    completeLesson({
      lesson_id: 'lesson-uuid',
      score: 85,
      time_spent: 300,
    });
  };

  // ... rest of component
};
```

### 3. Guest Flow Implementation

```typescript
// Check if user should be prompted to register
if (hasReachedGuestLimit()) {
  // Show registration prompt
  showRegistrationModal();
}

// Check if user can access a lesson
if (!isLessonAccessible(lessonId)) {
  // Show access denied message or registration prompt
}

// Handle heart system
if (!hasHearts()) {
  // Show "watch ad" or "register" options
}
```

### 4. Direct Service Usage

If you need to use the service directly without Redux:

```typescript
import { guestService } from '@/modules/guest';

// Create session
const sessionData = await guestService.createSession({
  device_id: 'unique-device-id'
});

// Complete lesson
const result = await guestService.completeLesson(sessionId, {
  lesson_id: 'lesson-uuid',
  score: 85,
  time_spent: 300,
});
```

## Guest User Limitations

According to the requirements document:

1. **Lesson Limit**: Can only complete 2 lessons
2. **No Registration Benefits**: 
   - No daily heart reset
   - No cloud sync
   - No leaderboard access
   - No community features
3. **Heart System**: Must watch ads to restore hearts
4. **Local Storage**: Progress stored only on device

## State Management

### Guest State Structure

```typescript
interface GuestState {
  session: GuestSession | null;
  progress: GuestProgress | null;
  loading: boolean;
  error: string | null;
  isGuestMode: boolean;
  lessonAccess: {
    [lessonId: string]: {
      can_access: boolean;
      reason: string;
      hearts_needed: number;
    };
  };
}
```

### Available Actions

- `setGuestMode(boolean)` - Set guest mode state
- `clearGuestData()` - Clear all guest data
- `clearError()` - Clear error state

### Available Thunks

- `createGuestSession()` - Create new guest session
- `getGuestProgress(sessionId)` - Get guest progress
- `checkGuestLessonAccess({sessionId, lessonId})` - Check lesson access
- `completeGuestLesson({sessionId, lessonData})` - Complete lesson
- `addGuestHearts(sessionId)` - Add hearts from ads
- `loseGuestHeart(sessionId)` - Lose heart from failed lesson

## Device Management

The module automatically handles device identification:

```typescript
import { getOrCreateDeviceId, isGuestMode } from '@/modules/guest';

// Get or create unique device ID
const deviceId = await getOrCreateDeviceId();

// Check if currently in guest mode
const isGuest = await isGuestMode();
```

## Error Handling

All API calls include proper error handling:

```typescript
const { error, clearGuestError } = useGuest();

useEffect(() => {
  if (error) {
    // Handle error (show toast, alert, etc.)
    Alert.alert('Error', error);
    clearGuestError();
  }
}, [error, clearGuestError]);
```

## Integration with Registration Flow

When a guest decides to register:

```typescript
import { clearGuestSession } from '@/modules/guest';

const handleRegister = async (userData) => {
  // Clear guest session data
  await clearGuestSession();
  
  // Proceed with registration
  // Guest progress can be migrated to user account if needed
};
```

## Example Component

See `modules/guest/components/GuestModeExample.tsx` for a complete working example that demonstrates all guest functionality.

## Testing

To test guest functionality:

1. Clear app data/storage
2. Open app without logging in
3. Try completing lessons (should work for first 2)
4. Try accessing 3rd lesson (should be blocked)
5. Test heart system by failing lessons
6. Test ad watching to restore hearts

## Notes

- Guest sessions are persistent across app restarts
- Device ID is generated once and stored locally
- All guest data is stored locally and not synced to cloud
- Guest mode automatically switches to registration prompt after 2 lessons
