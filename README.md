# OneAI

A full-stack AI utility web app with user authentication. OneAI lets users generate content (articles, blog titles, images), remove image backgrounds/objects, and upload resumes for AI-powered review. The project uses Clerk for authentication, Neon (Postgres) for persistence, Cloudinary for images, and Google Gemini (via an OpenAI-compatible client) for text generation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack & Architecture](#tech-stack--architecture)
4. [Project Structure](#project-structure)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)
7. [Setup & Run Locally](#setup--run-locally)
8. [API Endpoints](#api-endpoints)
9. [Frontend Pages & Behavior](#frontend-pages--behavior)
10. [Notes, Limitations & TODOs](#notes-limitations--todos)
11. [License](#license)

---

## Project Overview

OneAI is an AI utilities platform combining multiple AI-based utilities under a single app:

- **Text generation:** Long-form articles, blog title generation.
- **Image generation:** Create images from prompts (stored in Cloudinary).
- **Image editing:** Remove background or objects from images.
- **Resume review:** Upload resumes (PDF) for AI-powered feedback.
- **Social features:** Publish creations, like/unlike, view published content.
- **Authentication:** Clerk with user metadata tracking (e.g., free usage / plan).

---

## Features

- Server-side endpoints to call Google Gemini (via OpenAI-compatible library).
- Persist user creations in a Neon/Postgres database.
- File uploads using multer.
- Cloudinary integration for image storage.
- Clerk user auth and middleware for route protection and user metadata.
- Client built with Vite + React and Tailwind CSS.

**Frontend Pages:** Home, Dashboard, Write Article, Blog Titles, Generate Images, Remove Background/Object, Resume Review, Community.

---

## Tech Stack & Architecture

**Frontend:**

- Vite + React (JSX)
- Tailwind CSS
- Clerk React SDK
- axios

**Backend:**

- Node.js (ESM) + Express
- openai library (calls Google Gemini endpoint)
- @clerk/express for Clerk middleware
- @neondatabase/serverless (neon) for DB
- Cloudinary (v2) for images
- multer for uploads
- pdf-parse for resume parsing
- axios

**Database:**

- Neon / Postgres (via neon package and SQL tagged template)

---

## Project Structure

```
OneAI-main/
├─ Client/                      # Frontend (Vite + React)
│  ├─ package.json
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ App.jsx
│  │  ├─ pages/
│  │  ├─ components/
│  │  └─ assets/
│  └─ public/
└─ server/                      # Backend (Express)
    ├─ package.json
    ├─ server.js
    ├─ configs/
    │  ├─ db.js
    │  ├─ cloudinary.js
    │  └─ multer.js
    ├─ middlewares/
    │  └─ auth.js
    ├─ controllers/
    │  ├─ aiController.js
    │  └─ userController.js
    └─ routes/
        ├─ aiRoutes.js
        └─ userRoutes.js
```

---

## Environment Variables

**Server (.env):**

- `DATABASE_URL` — Neon/Postgres connection string
- `GEMINI_API_KEY` — Google Gemini API key
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary secret
- `CLERK_API_KEY` or `CLERK_SECRET_KEY` — Clerk server key
- `VITE_BASE_URL` — (optional) base URL for client to backend

**Client (.env.local):**

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `VITE_BASE_URL` — e.g. http://localhost:3000

---

## Database Schema

```sql
CREATE TABLE creations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL,
  publish BOOLEAN DEFAULT FALSE,
  likes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_creations_user_id ON creations (user_id);
```

---

## Setup & Run Locally

**Prerequisites:** Node.js (>=16), npm/yarn, Neon/Postgres, Cloudinary, Clerk, Google Gemini API key

### Backend

```bash
cd server
npm install
# Create .env with required variables
# Prepare database: run SQL from Database Schema section
npm run server   # Dev (nodemon)
# or
npm start        # Prod
```

### Frontend

```bash
cd Client
npm install
# Create .env file in Client/ with VITE_CLERK_PUBLISHABLE_KEY and VITE_BASE_URL
npm run dev
# Open the client URL (e.g. http://localhost:5173)
```

---

## API Endpoints

All protected endpoints require Clerk authentication.

**AI Routes:**

- `POST /api/ai/generate-article` — `{ prompt, length }`
- `POST /api/ai/generate-blog-title` — `{ prompt }`
- `POST /api/ai/generate-image` — `{ prompt, publish }`
- `POST /api/ai/remove-image-background` — FormData: `image`
- `POST /api/ai/remove-image-object` — FormData: `image`
- `POST /api/ai/resume-review` — FormData: `resume`

**User Routes:**

- `GET /api/user/get-user-creations`
- `GET /api/user/get-published-creations`
- `POST /api/user/toggle-like-creation` — `{ id }`

---

## Frontend Pages & Behavior

- **Home:** Marketing & quick access
- **Dashboard:** View your creations
- **Write Article:** Create articles
- **Blog Titles:** Generate blog titles
- **Generate Images:** Prompt-based image generation
- **Remove Background/Object:** Upload and process images
- **Resume Review:** Upload PDF for AI feedback
- **Community:** View published creations

**Notes:**

- `axios.defaults.baseURL = import.meta.env.VITE_BASE_URL` in client
- Client expects `VITE_CLERK_PUBLISHABLE_KEY`

---

## Notes, Limitations & TODOs

- Free usage and plan tracking via Clerk user metadata
- AI endpoints limited per user (free usage)
- Resume review uses pdf-parse and AI
- Some features may require further configuration per deployment

---

## License

[MIT](LICENSE)
