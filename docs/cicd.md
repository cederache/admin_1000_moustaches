# CI/CD Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) workflows for the Admin 1000 Moustaches project.

## Overview

The project uses GitHub Actions for automated testing, building, and deployment. There are two main workflows:

- **Frontend CI/CD** (`.github/workflows/front.yml`)
- **Server CI/CD** (`.github/workflows/server.yml`)

Both workflows follow a similar pattern with three main jobs: test, build, and deploy.

## Frontend CI/CD Workflow

### File: `.github/workflows/front.yml`

This workflow manages the React frontend application deployment to Firebase Hosting.

#### Triggers

The workflow is triggered on:
- **Pull Requests** to `main` branch when changes are made to:
  - `front/**` directory
  - `.github/workflows/front.yml` file
- **Push** to `main` branch when changes are made to:
  - `front/**` directory
  - `.github/workflows/front.yml` file
- **Manual trigger** (`workflow_dispatch`)

#### Jobs

##### 1. Test Job
- **Runs on**: `ubuntu-latest`
- **Condition**: Only on pull requests from `release/*` or `hotfix/*` branches
- **Working directory**: `./front`
- **Steps**:
  1. Checkout code
  2. Setup Node.js (version 20) with npm cache
  3. Install dependencies (`npm ci`)
  4. Run tests (`npm test`)

##### 2. Build Job
- **Runs on**: `ubuntu-latest`
- **Condition**: Only on push to `main` branch
- **Working directory**: `./front`
- **Environment**: `production`
- **Steps**:
  1. Checkout code
  2. Setup Node.js (version 20) with npm cache
  3. Install dependencies (`npm ci`)
  4. Create `.env.production` file with secrets:
     - `VITE_API_URL`
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_DATABASE_URL`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGE_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MESUREMENT_ID`
     - `VITE_GEOAPPIFY_API_KEY`
  5. Build the application (`npm run build`)
  6. Upload build artifacts

##### 3. Deploy Job
- **Runs on**: `ubuntu-latest`
- **Condition**: Only on push to `main` branch
- **Environment**: `production`
- **Dependencies**: Requires successful completion of build job
- **Steps**:
  1. Checkout code
  2. Download build artifacts
  3. Setup Node.js (version 20)
  4. Decode Google credentials from base64
  5. Install Firebase CLI (version 14.2.2)
  6. Deploy to Firebase Hosting
  7. Clean up credentials file

#### Required Secrets

The following secrets must be configured in the GitHub repository:

**Firebase Configuration:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGE_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MESUREMENT_ID`

**API Configuration:**
- `VITE_API_URL`
- `VITE_GEOAPPIFY_API_KEY`

**Deployment:**
- `GOOGLE_APPLICATION_CREDENTIALS` (base64 encoded service account JSON)

## Server CI/CD Workflow

### File: `.github/workflows/server.yml`

This workflow manages the Node.js Express server deployment to Firebase Functions.

#### Triggers

The workflow is triggered on:
- **Pull Requests** to `main` branch when changes are made to:
  - `server/**` directory
  - `.github/workflows/server.yml` file
- **Push** to `main` branch when changes are made to:
  - `server/**` directory
  - `.github/workflows/server.yml` file
- **Manual trigger** (`workflow_dispatch`)

#### Jobs

##### 1. Test Job
- **Runs on**: `ubuntu-latest`
- **Condition**: Only on pull requests from `release/*` or `hotfix/*` branches
- **Working directory**: `./server`
- **Steps**:
  1. Checkout code
  2. Setup Node.js (version 20) with npm cache
  3. Install dependencies (`npm ci`)
  4. Run tests (`npm test`)

##### 2. Build Job
- **Runs on**: `ubuntu-latest`
- **Condition**: On push to `main` branch OR manual trigger
- **Working directory**: `./server`
- **Steps**:
  1. Checkout code
  2. Setup Node.js (version 20) with npm cache
  3. Install dependencies (`npm ci`)
  4. Create `.env.production` file with secrets:
     - `DB_HOST`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_NAME`
     - `NODE_ENV=production`
  5. Build the application (`npm run build:prod`)
  6. Upload build artifacts

##### 3. Deploy Job
- **Runs on**: `ubuntu-latest`
- **Condition**: On push to `main` branch OR manual trigger
- **Environment**: `production`
- **Dependencies**: Requires successful completion of build job
- **Steps**:
  1. Checkout code
  2. Download build artifacts
  3. Setup Node.js (version 20)
  4. Decode Google credentials from base64
  5. Install Firebase CLI (version 14.2.2)
  6. Create `.env.production` file again
  7. Copy `.env.production` to `.env`
  8. Deploy to Firebase Functions with debug mode
  9. Clean up credentials file

#### Required Secrets

The following secrets must be configured in the GitHub repository:

**Database Configuration:**
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

**Deployment:**
- `GOOGLE_APPLICATION_CREDENTIALS` (base64 encoded service account JSON)

## Google Cloud Service Account Setup

For the CI/CD workflows to function properly, a Google Cloud service account must be created with the following roles:

- **Administrateur Firebase Hosting**
- **Administrateur d'extension Firebase**
- **Editeur d'extensions Firebase**
- **Dévelopeur d'extensions Firebase**
- **Administrateur des objets Storage**
- **Administrateur Cloud Function**
- **Administrateur Logging**
- **Utilisateur du compte de service**

### Creating the Service Account Key

1. Create a service account in Google Cloud Console
2. Assign the required roles listed above
3. Generate a JSON key for the service account
4. Encode the JSON file to base64:
   ```bash
   base64 -b -i key.json -o key-base64.json
   ```
5. Add the content of `key-base64.json` as the `GOOGLE_APPLICATION_CREDENTIALS` secret in GitHub
