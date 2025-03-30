# Chat App

A real-time chat application that supports multiple connected clients with synchronized messages and participant presence tracking.

## 🚀 Features

-   Real-time messaging between users
-   Participant presence awareness
-   Edit and delete your own messages (visible to others)
-   Clean, minimal UI based on mock design

## 🛠 Tech Stack

### Frontend

-   React (Vite)
-   TypeScript
-   Native WebSocket API
-   Redux Toolkit (for state management)

### Backend

-   Node.js (with Express)
-   WebSocket server (`ws`)
-   TypeScript

## 📁 Project Structure

```plaintext
chat-app/
├── backend/
├── frontend/
└── README.md
```

---

## 🧩 Setup Instructions

### Prerequisites

-   Node.js (v18+ recommended)
-   npm (or yarn/pnpm)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/jacekroszkowiakdev/chat-app.git
cd chat-app
```

### 2️⃣ Setup the Backend

```bash
cd backend
npm install
npm run dev
```

> This starts the WebSocket + Express server on `http://localhost:3001`.

**Backend File Structure:**

```plaintext
backend/
├── src/
│   ├── handlers/
│   │   ├── message.handlers.ts
│   │   └── user.handlers.ts
│   ├── server.ts
│   ├── services/
│   │   ├── message.service.ts
│   │   └── user.service.ts
│   ├── types.ts
│   └── utils/
│       ├── colorGenerator.ts
│       └── websocket.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

### 3️⃣ Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

> This starts the frontend development server on `http://localhost:5173`.

**Frontend File Structure:**

```plaintext
frontend/
├── public/
├── src/
│   ├── components/         # React components
│   ├── store/
│   │   ├── middleware/     # Custom Redux middleware (e.g. WebSocket)
│   │   └── slices/         # Redux slices (state logic)
│   ├── hooks/              # Custom hooks
│   ├── services/           # Service helpers (optional)
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ✅ Status

-   Backend: ✅ Fully implemented
-   Frontend: 🚧 Work in progress

---

## 📬 Contact

Feel free to reach out with suggestions or issues via [GitHub Issues](https://github.com/jacekroszkowiakdev/chat-app/issues).

---

Made with ❤️ by Jacek Roszkowiak
