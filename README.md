# Chat app

A real-time chat application that supports multiple connected clients with message synchronization and participant awareness.

## Features

-   Real-time messaging between multiple users
-   User presence tracking and active participant list
-   Message editing and deletion (with visibility for all participants)
-   Simple, clean UI matching a mock design

## Tech Stack

### Frontend

-   React (via Vite)
-   TypeScript
-   Native WebSocket client API

### Backend

-   Node.js with Express
-   Native WebSocket server (`ws`)
-   TypeScript

## Project Structure

```
app-chat/
├── backend/
├── frontend/
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

-   Node.js (v18+ recommended)
-   npm (or yarn/pnpm)

---

### 1. Clone the Repository

```bash
git clone https://github.com/jacekroszkowiakdev/chat-app.git
cd chat-app
```

### 2. Setup the Backend

```bash
cd backend
npm install
npm run dev
```

This starts the WebSocket + Express server on `http://localhost:3001`.

### 3. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

This starts the frontend dev server (Vite) on `http://localhost:5173`.
