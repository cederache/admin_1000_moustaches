# Development Guide

This document provides detailed instructions for setting up and running the Admin 1000 Moustaches project in development mode.

## Architecture Overview

The project consists of:
- **Frontend**: React.js application (`/front` directory)
- **Backend**: Node.js Express server (`/server` directory)
- **Database**: MySQL database (containerized)

## Installation Methods

### Recommended Method (with Docker)

This is the easiest way to get started and ensures consistency across different development environments.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin_1000_moustaches
   ```

2. **Create environment file**
   
   Create a `.env.local` file at the project root with the necessary environment variables:
   ```bash
   # Database configuration
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=admin_1000_moustaches
   DB_ROOT_PASSWORD=your_root_password
   
   # Add other required environment variables
   ```

3. **Start the application**
   ```bash
   npm run start:fresh
   ```

### Manual Method (without Docker)

For developers who prefer to run services individually or need more control over the setup.

#### Database Setup

1. **Build the Docker image** from the `docker/database` directory:
   ```bash
   cd docker/database
   docker build \
     --build-arg DB_ROOT_PASSWORD=$(grep DB_ROOT_PASSWORD ../../server/.env | cut -d '=' -f2) \
     --build-arg DB_NAME=$(grep DB_NAME ../../server/.env | cut -d '=' -f2) \
     --build-arg DB_USER=$(grep DB_USER ../../server/.env | cut -d '=' -f2) \
     --build-arg DB_PASSWORD=$(grep DB_PASSWORD ../../server/.env | cut -d '=' -f2) \
     -t mysql-docker .
   ```

2. **Launch the container** in Docker Desktop

#### Application Setup

1. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd front
   npm install
   ```

## Development Workflows

### Database + Docker, Applications Local (Recommended for Development)

This setup provides the best balance between consistency (Docker database) and development flexibility (local applications with hot reload).

1. **Start the database**
   ```bash
   npm run start:fresh:database-only
   ```

2. **Start the server** (in a new terminal)
   ```bash
   cd server
   npm run dev
   ```

3. **Load test data** (in a new terminal)
   ```bash
   cd server
   npm run dev:fixtures
   ```

4. **Start the frontend** (in a new terminal)
   ```bash
   cd front
   npm run start:dev
   ```

### Complete Docker Setup (Recommended for Quick Local Launch)

Ideal when you want to quickly run the entire application without individual service management.

- **Start everything**
  ```bash
  npm run start
  ```

- **Fresh start with empty database**
  ```bash
  npm run start:fresh
  ```

- **Fresh start with test data**
  ```bash
  npm run start:fresh:fixtures
  ```

### Without Docker

For environments where Docker is not available or preferred.

1. **Start the server with Firebase Emulator**
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend** (in a new terminal)
   ```bash
   cd front
   npm start
   ```

## Available NPM Commands

### Root Level Commands (package.json)

| Command | Description |
|---------|-------------|
| `npm run start` | Launch the application with Docker Compose |
| `npm run start:fresh` | Stop containers, remove volumes, and restart the application |
| `npm run start:fresh:detached` | Same as start:fresh but in detached mode |
| `npm run start:fresh:fixtures` | Launch the application with data fixtures |
| `npm run start:fresh:database-only` | Start only the database container |
| `npm run docker:fixtures` | Execute fixtures in the Docker container |
| `npm run set-version -- X.Y.Z` | Update version in all package.json files (root, front, server) |
| `npm run restart:docker -- <service>` | Restart specific container (e.g., `npm run restart:docker -- front`) |

### Server Commands (server/package.json)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server in development mode with watch |
| `npm run dev:fixtures` | Load development fixtures into database |
| `npm start` | Start server with Firebase Emulator |
| `npm run build:prod` | Build server for production |
| `npm test` | Run server tests |

### Frontend Commands (front/package.json)

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start frontend in development mode |
| `npm start` | Start frontend development server |
| `npm run build` | Build frontend for production |
| `npm test` | Run frontend tests |

## Environment Configuration

### Frontend Environment Variables

Create `.env` files in the `front` directory:

```bash
# .env.local (for local development)
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGE_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MESUREMENT_ID=your_measurement_id
VITE_GEOAPPIFY_API_KEY=your_geoappify_key
```

### Server Environment Variables

Create `.env` files in the `server` directory:

```bash
# .env (for local development)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=admin_1000_moustaches
NODE_ENV=development
```

## Database Management

### Fixtures and Test Data

The project includes fixtures for development and testing:

- **Load fixtures**: `npm run dev:fixtures` (from server directory)
- **Docker fixtures**: `npm run docker:fixtures` (from root)

### Migrations

Database migrations are located in `server/migrations/`:
- Migrations are automatically run when starting the server
- New migrations should follow the existing naming convention

## Development Tips

### Hot Reload

- **Frontend**: Vite provides hot module replacement (HMR) automatically
- **Server**: `npm run dev` uses nodemon for automatic restarts on file changes

### Debugging

- **Frontend**: Use browser developer tools
- **Server**: Node.js debugger is available, configure your IDE accordingly
- **Database**: Connect to the containerized MySQL using your preferred database client

### Port Configuration

Default ports:
- **Frontend**: 3000
- **Server**: 3001
- **Database**: 3306

### Docker Management

- **View logs**: `docker-compose logs <service-name>`
- **Restart service**: `npm run restart:docker -- <service-name>`
- **Stop all services**: `docker-compose down`
- **Remove volumes**: `docker-compose down -v`
