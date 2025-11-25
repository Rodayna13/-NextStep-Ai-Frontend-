# DemoPage Refactored Structure

This directory contains the refactored DemoPage component with improved modularity and maintainability.

## Directory Structure

```
DemoPage/
├── components/           # UI Components
│   ├── AIPanel.jsx      # AI interviewer panel
│   ├── UserPanel.jsx    # User panel with mic control
│   ├── Waveform.jsx     # Processing animation
│   ├── TranscriptPanel.jsx  # Conversation transcript
│   ├── ControlPanel.jsx # Bottom control buttons
│   └── index.js         # Component exports
├── hooks/               # Custom React Hooks
│   └── useInterviewSession.js  # Interview session state management
├── utils/               # Utility Functions
│   ├── promptGenerator.js  # System prompt generation
│   ├── chatService.js   # API and AI response handling
│   └── index.js         # Utility exports
└── DemoPage.jsx         # Main component

```

## Components

### UserPanel
Displays user avatar, status, and microphone button.

**Props:**
- `isRecording` (boolean): Whether user is currently speaking
- `transcript` (string): Current transcript text
- `interim` (string): Interim transcript text
- `onStartRecording` (function): Callback to start recording

### AIPanel
Displays AI coach avatar, status, and audio controls.

**Props:**
- `isPlaying` (boolean): Whether AI is currently speaking
- `audioRef` (object): Audio element reference

### Waveform
Animated waveform display during processing.

**Props:**
- `isVisible` (boolean): Whether to show the waveform

### TranscriptPanel
Shows conversation history between user and AI.

**Props:**
- `history` (array): Array of message objects with `role` and `content`

### ControlPanel
Bottom control panel with mic, transcript toggle, and end call buttons.

**Props:**
- `onStartRecording` (function): Callback to start recording
- `onEndCall` (function): Callback when call ends

## Hooks

### useInterviewSession
Manages interview session state and logic.

**Parameters:**
- `handleSpeak` (function): TTS function
- `transcribeAudioSimple` (function): Transcription function
- `speechRecognition` (object): Speech recognition hook

**Returns:**
- `history`: Conversation history
- `setHistory`: Update conversation history
- `isProcessing`: Processing state
- `summary`: Chat summary
- `isSummarizing`: Summarization state
- `assistantConfig`: Current assistant configuration
- `setAssistantConfig`: Update assistant configuration
- `processAIResponse`: Process AI response function

## Utility Functions

### promptGenerator.js

#### generateSystemPrompt(config)
Generates a custom system prompt based on user configuration.

**Parameters:**
- `config` (object): Assistant configuration with tone, energy, difficulty, etc.

**Returns:** String - Generated system prompt

#### getDefaultSystemPrompt()
Returns the default system prompt.

**Returns:** String - Default system prompt

#### getInitialGreeting(config)
Gets the initial greeting in the configured language.

**Parameters:**
- `config` (object|null): Assistant configuration

**Returns:** String - Greeting message

### chatService.js

#### summarizeChat(messages)
Summarizes the chat conversation via API.

**Parameters:**
- `messages` (array): Array of message objects

**Returns:** Promise<string|null> - Summary or null if failed

#### processAIResponse(conversationHistory, handleSpeak, transcribeAudioSimple, voice)
Processes AI response with TTS and transcription.

**Parameters:**
- `conversationHistory` (array): Conversation history
- `handleSpeak` (function): TTS function
- `transcribeAudioSimple` (function): Transcription function
- `voice` (string): Voice to use (default: 'alloy')

**Returns:** Promise<string|null> - Bot response or null if failed

## Usage Example

```jsx
import DemoPage from './pages/DemoPage/DemoPage';

function App() {
    return <DemoPage />;
}
```

## Key Features

- **Modular Components**: Each UI section is a separate, reusable component
- **Custom Hooks**: Business logic separated into custom hooks
- **Utility Functions**: Pure functions for prompt generation and API calls
- **PropTypes**: Type checking for all component props
- **Clean Code**: Well-documented with JSDoc comments
- **Maintainable**: Easy to test, modify, and extend

## Benefits of Refactoring

1. **Separation of Concerns**: UI, logic, and utilities are clearly separated
2. **Reusability**: Components and functions can be reused in other parts of the app
3. **Testability**: Smaller, focused units are easier to test
4. **Readability**: Main component is now ~120 lines vs ~400 lines
5. **Maintainability**: Changes to one part don't affect others
6. **Scalability**: Easy to add new features without cluttering existing code
