# Firebase Time Tracker Integration

This document explains how the Firebase Firestore integration works for the Chronix time tracker app.

## 🏗️ Database Structure

### Collection: `sessions`

Each document represents a work session with the following fields:

```typescript
{
  userId: string;           // Firebase Authentication UID
  startAt: Timestamp;       // When user punched in
  endAt?: Timestamp;        // When user punched out (optional)
  durationMinutes?: number; // Total session time in minutes (optional)
}
```

## 🔧 Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Enable Authentication with Google Sign-in provider
4. Enable Firestore Database in production mode
5. Set up Firestore security rules (see below)

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration values from Project Settings

### 3. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null &&
                        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
                   request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 📋 Core Functionality

### Punch In Process

1. **Authentication Check**: Verify user is signed in
2. **Create Session**: Add new document to `sessions` collection
    ```typescript
    {
      userId: currentUser.uid,
      startAt: Timestamp.now()
    }
    ```
3. **Local Storage**: Store session ID and start time
4. **UI Update**: Start live timer display

### Punch Out Process

1. **Session Validation**: Verify active session exists
2. **Calculate Duration**: `endTime - startTime` in minutes
3. **Update Document**: Add `endAt` and `durationMinutes`
4. **Cleanup**: Clear localStorage and stop timer

### App Initialization

1. **Check localStorage**: Look for active session ID
2. **Validate Session**: Verify session still exists in Firestore
3. **Handle Stale Data**: Clean up if session was ended elsewhere
4. **Auto Punch Out**: Handle overnight sessions (11:59 PM cutoff)
5. **Resume Timer**: Continue counting from stored start time

## 🔄 State Management

### SessionContext

Manages global session state with the following:

-   `currentSession`: Active session data from Firestore
-   `isPunchedIn`: Boolean indicating current status
-   `currentDuration`: Live timer string (HH:MM:SS format)
-   `isLoading`: Loading state for operations
-   `error`: Error messages for user feedback

### Key Features

-   **Real-time Updates**: Timer updates every second
-   **Persistent State**: Survives browser refresh/restart
-   **Error Handling**: User-friendly error messages
-   **Auto Cleanup**: Handles incomplete sessions

## 🕒 Auto Punch Out

### Midnight Cutoff

If a user forgets to punch out:

1. **Detection**: Check if session started on different day
2. **Auto End**: Set `endAt` to 11:59:59 PM of start date
3. **Calculate**: Duration from start to 11:59:59 PM
4. **Cleanup**: Clear localStorage and reset UI

### Frequency

-   Checked on app load
-   Checked every hour while session is active

## 📊 Data Flow

```
User Action → SessionContext → Firestore Service → Firebase
     ↓              ↓               ↓            ↓
UI Update ← State Update ← Response ← Database Update
```

## 🛠️ API Reference

### Core Functions (firestore.ts)

#### `createSession(userId: string)`

Creates new punch-in session

-   Returns: `{ sessionId, startAt }`
-   Stores in localStorage
-   Throws on error

#### `endSession(sessionId: string)`

Ends active session

-   Returns: `{ durationMinutes }`
-   Clears localStorage
-   Throws on error

#### `getSession(sessionId: string)`

Retrieves session by ID

-   Returns: `Session | null`
-   Used for validation

#### `getCurrentActiveSession(userId: string)`

Finds user's active session (no endAt)

-   Returns: `Session | null`
-   Used on app initialization

#### `checkAndHandleAutoPunchOut()`

Handles overnight auto punch out

-   Returns: `boolean` (true if auto punch out occurred)
-   Runs automatically

## 🎯 Usage Examples

### Basic Punch In/Out

```typescript
const { punchIn, punchOut, isPunchedIn } = useSession();

// Punch in
await punchIn();

// Punch out
if (isPunchedIn) {
    await punchOut();
}
```

### Session Status Display

```typescript
const { currentDuration, isPunchedIn, currentSession } = useSession();

return (
    <div>
        <p>Status: {isPunchedIn ? "Working" : "Not Working"}</p>
        <p>Duration: {currentDuration}</p>
        {currentSession && (
            <p>Started: {currentSession.startAt.toDate().toLocaleString()}</p>
        )}
    </div>
);
```

## 🚨 Error Handling

### Common Errors

-   **Authentication**: User not signed in
-   **Network**: Firebase connection issues
-   **Permissions**: Firestore security rules
-   **Data**: Session not found or corrupted

### Error Display

Errors are shown in the UI with:

-   Red background alert box
-   Auto-dismiss after 5 seconds
-   User-friendly messages

## 🔒 Security Considerations

1. **Authentication Required**: All operations require signed-in user
2. **User Isolation**: Users can only access their own sessions
3. **Validation**: Server-side validation through security rules
4. **XSS Protection**: Data sanitization in UI components

## 📱 Mobile Considerations

-   **Background Timers**: Continue running when app is backgrounded
-   **Network Changes**: Handle offline/online transitions
-   **Battery Optimization**: Efficient timer implementation
-   **Local Storage**: Persists across app launches

## 🧪 Development & Testing

### Debug Mode

In development, session info is displayed:

-   Session ID
-   Start timestamp
-   Current status

### Testing Checklist

-   [ ] Punch in creates Firestore document
-   [ ] Timer displays and updates correctly
-   [ ] Punch out calculates duration properly
-   [ ] Page refresh maintains session state
-   [ ] Auto punch out works at midnight
-   [ ] Error handling displays properly
-   [ ] Multiple browser tabs sync correctly

## 🚀 Deployment

1. Ensure Firebase configuration is set in production environment
2. Update Firestore security rules
3. Test with production Firebase project
4. Monitor error rates and performance

This integration provides a robust, scalable solution for time tracking with real-time updates and proper data persistence.
