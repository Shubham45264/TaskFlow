# TaskFlow — Modern Project Management

TaskFlow is a high-performance, aesthetically pleasing task management application built with React, TypeScript, and Tailwind CSS. It features a complete project tracking system, inclusive of task lifecycle management, priority setting, and a unified dashboard for peak productivity.

## ✨ Key Features

- **Strategic Dashboard**: Real-time overview of project velocity and task distribution.
- **Project Governance**: Create and manage multiple projects with distinct metadata.
- **Task Lifecycle**: Full CRUD operations for tasks with status (Todo, In Progress, Done) and priority scaling.
- **Identity Management**: Mock authentication system for profile customization and session persistence.
- **Premium UX**: Responsive design with a custom glassy dark aesthetic, smooth transitions, and high-fidelity typography.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: LocalStorage (Mock API implementation)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Backend (Render)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB URI
  - `JWT_SECRET`: Your JWT Secret
  - `NODE_ENV`: `production`

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Environment Variables**:
  - `VITE_API_URL`: `https://taskflow-backend-jgw4.onrender.com` (Your Render Backend URL)

---

## 📂 Project Structure
...
