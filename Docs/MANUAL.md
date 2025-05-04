# Bodega Esports Platform Manual

## Overview

The Bodega Esports Platform is a comprehensive solution for managing esports leagues, teams, and tournaments. It includes features for administrators, players, and spectators, providing tools for league creation, team management, match scheduling, and more. This manual provides detailed instructions for setting up, running, and troubleshooting the platform.

---

## Table of Contents

- [Bodega Esports Platform Manual](#bodega-esports-platform-manual)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Frontend](#frontend)
    - [Structure Details](#structure-details)
    - [Running the Frontend](#running-the-frontend)
    - [Key Components](#key-components)
  - [Backend](#backend)
    - [Structure](#structure-1)
    - [Running the Backend](#running-the-backend)
    - [API Endpoints](#api-endpoints)
  - [Supabase Integration](#supabase-integration)
    - [Configuration](#configuration)
    - [Custom Functions](#custom-functions)
  - [OCR Automation](#ocr-automation)
    - [Overview](#overview-1)
    - [Running the OCR Module](#running-the-ocr-module)
  - [Deployment](#deployment)
    - [Frontend Deployment](#frontend-deployment)
    - [Backend Deployment](#backend-deployment)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Support](#support)
  - [License](#license)

---

## Getting Started

### Prerequisites

Ensure the following tools and accounts are set up before proceeding:

- **Node.js and npm**: Required for the frontend. Install the latest version from [Node.js official site](https://nodejs.org/).
- **Python 3.12 or higher**: Required for the backend. Download it from [Python's official site](https://www.python.org/).
- **Supabase account**: For database and authentication. Sign up at [Supabase](https://supabase.com/).
- **Docker**: For OCR automation and containerized deployment. Install Docker from [Docker's official site](https://www.docker.com/).

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd bodega-esports-platform
   ```

2. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up Supabase**:

   - Create a Supabase project.
   - Import the database schema from `supabase/schema.sql`.
   - Configure API keys in `supabaseClient.js`.

---

## Frontend

### Structure Details

- `frontend/components`: Reusable UI components such as `Navbar` and `NotificationsBell`.
- `frontend/pages`: Page-level components for views like `Dashboard`, `Leaderboard`, and `Login`.
- `frontend/hooks`: Custom React hooks for state management and API calls.
- `frontend/theme.css`: Centralized styling for consistent UI.

### Running the Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:3000`.

### Key Components

- **Admin Pages**: Tools for league administrators to manage leagues, teams, and matches. Examples include `AdminCreateLeague.jsx` and `AdminReviewMatches.jsx`.
- **Player Pages**: Features for players to view stats, submit results, and manage profiles. Examples include `PlayerProfile.jsx` and `SubmitPlayerStats.jsx`.
- **Public Pages**: Accessible to spectators for viewing leaderboards, brackets, and match schedules. Examples include `PublicBracket.jsx` and `Leaderboard.jsx`.

---

## Backend

### Structure

The backend is a Python FastAPI application. Key directories include:

- `app/api`: API endpoints for handling requests.
- `app/models`: Database models for entities like `User`, `Team`, and `Match`.
- `app/routers`: Route definitions for modular API design.
- `app/utils`: Utility functions for common tasks like authentication and data validation.

### Running the Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Start the server:

   ```bash
   python main.py
   ```

3. Access the API documentation at `http://localhost:8000/docs`.

### API Endpoints

- **Authentication**: Endpoints for user login, registration, and session management.
- **League Management**: CRUD operations for leagues, teams, and matches.
- **Player Stats**: Endpoints for submitting and retrieving player statistics.

---

## Supabase Integration

### Configuration

1. Update the `supabase/config.toml` file with your Supabase project details.
2. Ensure the `supabaseClient.js` file in the frontend is configured with your Supabase URL and API key.

### Custom Functions

- **send-discord**: Sends announcements to Discord via webhooks.
- **get-free-agents**: Retrieves a list of players not currently on a team.

---

## OCR Automation

### Overview

The OCR automation module processes images and extracts data for further use, such as match results or player stats.

### Running the OCR Module

1. Navigate to the `OCR` directory:

   ```bash
   cd OCR
   ```

2. Start the Docker container:

   ```bash
   docker-compose up
   ```

3. Place files to process in the `toProcess/images` directory.
4. Processed files will be moved to the `processed/images` directory.

---

## Deployment

### Frontend Deployment

1. Deploy the frontend to Vercel:

   - Ensure the `vercel.json` file is configured with the correct build settings.
   - Run the deployment command:

     ```bash
     vercel deploy
     ```

### Backend Deployment

1. Containerize the backend using Docker:

   ```bash
   docker build -t bodega-backend .
   docker run -p 8000:8000 bodega-backend
   ```

2. Deploy to a cloud provider like AWS or Azure.

---

## Troubleshooting

### Common Issues

- **Frontend not starting**: Ensure all dependencies are installed and the `vite.config.js` file is correctly configured.
- **Backend errors**: Check the `backend/logs` directory for error logs.
- **Supabase connection issues**: Verify the API key and URL in the configuration files.
- **OCR module not processing files**: Ensure the Docker container is running and the `toProcess` directory is correctly configured.

### Support

For further assistance, contact the development team or refer to the project documentation.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
