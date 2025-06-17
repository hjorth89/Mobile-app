# Synapse AI Mobile App Skeleton

This repository contains a minimal React Native skeleton implementing the basic screens described in the main `README.md` plan.

## Available Screens

- **Home** – navigation entry point.
- **Summarize** – allows text or a URL input, with options for summary length and bullet formatting, then sends it to the OpenAI API.
- **Tasks** – intelligent task and project management with AI-powered prioritization, automatic breakdown of tasks, reminders and progress tracking.
- **Chat** – conversational co-pilot with optional voice input and spoken replies.

## Setup

1. Install dependencies with `npm install` (requires Node.js and React Native CLI). The chat screen uses `react-native-voice`, `react-native-tts` and `@react-native-async-storage/async-storage` for speech and persistence.
2. Copy `.env.example` to `.env` and add your `OPENAI_API_KEY`.
3. Run the Metro bundler with `npm start` and launch on a simulator or device using `npm run ios` or `npm run android`.

This code is provided as a starting point and is not production ready.
