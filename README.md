# API Key Manager - MERN Stack Application

A full-stack MERN application for managing API keys with secure generation, hashing, and validation.

## Features

- **User Authentication**: JWT-based authentication with Passport.js
- **Project Management**: Create and manage multiple projects
- **API Key Generation**: Generate secure API keys with live/test prefixes
- **Key Management**: View, revoke, and monitor API keys
- **Secure Storage**: API keys are hashed using bcrypt before storage
- **Usage Logging**: Track API key usage with timestamps and endpoints
- **Modern UI**: Built with React, Tailwind CSS, and Shadcn/ui components

## Tech Stack

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Passport.js (JWT Strategy)
- bcryptjs for password and API key hashing
- express-validator for input validation

### Frontend
- React 18
- React Router v6
- Vite
- Tailwind CSS
- Shadcn/ui components
- Axios for API calls

## Project Structure

```
api-key-manager/
├── backend/
│   ├── config/          # Database and Passport configuration
│   ├── models/          # MongoDB models (User, Project, ApiKey, UsageLog)
│   ├── routes/          # Express routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth and API key validation middleware
│   ├── utils/           # API key generation and hashing utilities
│   └── server.js         # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (UI components, cards, etc.)
│   │   ├── pages/       # Page components (Login, Register, Projects, etc.)
│   │   ├── context/     # React context (AuthContext)
│   │   ├── utils/       # API client utilities
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/api-key-manager
JWT_SECRET=your-jwt-key
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Projects (Protected)
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `DELETE /api/projects/:id` - Delete a project

### API Keys (Protected)
- `POST /api/keys/generate` - Generate a new API key
- `GET /api/keys?projectId=xxx` - Get all keys for a project
- `DELETE /api/keys/:id` - Revoke an API key

### Validation (Public)
- `POST /api/validate` - Validate an API key (requires `x-api-key` header)

## API Key Format

API keys follow the format: `ak_{prefix}_{32-char-base64}`

Example: `ak_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

- Prefix can be `live` or `test`
- The key is generated using cryptographically secure random bytes
- Keys are hashed with bcrypt before storage
- Raw keys are only returned once during generation

## Security Features

- Passwords and API keys are hashed using bcrypt
- JWT tokens for authentication
- API key validation middleware
- Usage logging for audit trails
- Never store raw API keys in the database

## Usage

1. Register a new account or login
2. Create a project
3. Generate API keys for your project
4. Copy the key immediately (it's only shown once)
5. Use the key in your applications by sending it in the `x-api-key` header
6. Monitor usage and revoke keys as needed

## License

ISC

