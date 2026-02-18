# TaskFlow Core API

A high-performance Node.js/Express backend for the TaskFlow project management suite. Features JWT authentication, MongoDB persistence, and humanized API responses.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` root based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Launch the server:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 🛠️ API Documentation

### Authentication
- `POST /api/users/register` - Onboard a new entity.
- `POST /api/users/login` - Authenticate and receive a JWT pulse.
- `GET /api/users/me` - Retrieve current session profile (Requires Bearer Token).

### Project Governance (Requires Authentication)
- `GET /api/projects` - List all active projects for the user.
- `POST /api/projects` - Initialize a new project.
- `PUT /api/projects/:id` - Refine project metadata.
- `DELETE /api/projects/:id` - Decommission a project and its tasks.

### Task Management (Requires Authentication)
- `GET /api/tasks` - Gather all tasks in the user's workspace.
- `POST /api/tasks` - Deploy a new task to a project.
- `PUT /api/tasks/:id` - Update task status or details.
- `DELETE /api/tasks/:id` - Remove a task from the system.

## 📂 Architecture

- `config/`: Database orchestration logic.
- `controllers/`: Human-centered business logic and request handling.
- `middleware/`: Security and authentication filters.
- `models/`: Mongoose schemas for User, Project, and Task entities.
- `routes/`: Express router definitions.

## 📝 License
MIT License. Crafted with precision for TaskFlow.
