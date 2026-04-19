# Admin 1000 Moustaches

Ce site permet la gestion des animaux, des familles d'accueil, des vétérinaires et de leurs interventions.
Le front est réalisé en ReactJS et le server en NodeJS Express.

## 📚 Documentation

This project's documentation is organized into several specialized guides:

- **[Development Guide](docs/development.md)** - Complete setup and development instructions
- **[Git Workflow](docs/git-workflow.md)** - Git conventions, commit standards, and branch strategy
- **[CI/CD Documentation](docs/cicd.md)** - Comprehensive guide to GitHub Actions workflows

## 🚀 Quick Start

### Prerequisites

- Node.js 22
- Docker and Docker Compose
- Git

### Recommended Setup (Docker)

1. **Clone and configure**

   ```bash
   git clone <repository-url>
   cd admin_1000_moustaches
   git config core.hooksPath .githooks
   ```

2. **Create local environment files** by copying each `.env.example` (paths are relative to the repository root; local files are gitignored)

   | Path               | Role                                                                                                                                                                                          |
   | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `.env.local`       | Local copy of `.env.example` for Docker Compose (`npm run start:*`, `npm run dev:down`): database credentials, `NODE_ENV`, and `VITE_*` variables passed into containers (see `compose.yml`). |
   | `server/.env`      | Local copy of `server/.env.example` for Node server, migrations, and fixtures.                                                                                                                |
   | `front/.env.local` | Local copy of `front/.env.example` for Vite dev server (`front/`): `VITE_API_URL`, Firebase, Geoapify keys.                                                                                   |

   ```bash
   cp .env.example .env.local
   cp server/.env.example server/.env
   cp front/.env.example front/.env.local
   ```

3. **Start the application**

### Development Mode

Start the full dev stack (database, server, frontend with hot reload and fixtures) in one command:

```bash
npm run start:dev:all
```

or the command to launch in splitted terminal (tmux needed) :

```bash
npm run start:dev:all:split
```

This starts the database in the background, waits until MySQL is ready, loads fixtures, then runs the server and frontend. Use Ctrl+C to stop server and frontend; the database keeps running. Stop it with:

```bash
npm run dev:down
```

To run services manually in separate terminals, use `npm run start:fresh:database-only` then start the server and frontend from `server/` and `front/` (see [Development Guide](docs/development.md)).

## 🏗️ Architecture

- **Frontend** (`/front`): React.js with Vite
- **Backend** (`/server`): Node.js Express with TypeScript
- **Database**: MySQL (containerized)
- **Deployment**: Firebase Hosting (frontend) + Firebase Functions (backend)

## 🛠️ Key Commands

| Command                             | Description                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `npm run start:dev:all`             | Start full dev stack (DB + server + front with fixtures) |
| `npm run dev:down`                  | Stop Docker services                                     |
| `npm run start`                     | Start full stack with Docker Compose                     |
| `npm run start:fresh`               | Fresh start (clean DB, full stack)                       |
| `npm run start:fresh:fixtures`      | Fresh start with test data (full stack)                  |
| `npm run start:fresh:database-only` | Database only, foreground                                |
| `npm run restart:docker`            | Restart Docker services                                  |

## 🔧 CI/CD

The project uses GitHub Actions for automated testing and deployment:

- **Frontend**: Deploys to Firebase Hosting on push to `main`
- **Backend**: Deploys to Firebase Functions on push to `main`
- **Testing**: Runs on PRs from `release/*` and `hotfix/*` branches

For detailed CI/CD information, see [CI/CD Documentation](docs/cicd.md).

## 📝 Contributing

1. Follow the [Git Workflow](docs/git-workflow.md) for branch strategy and commit conventions
2. Ensure tests pass before submitting PRs
3. Use conventional commits format
4. Review the [Development Guide](docs/development.md) for setup details

## 🔗 Links

- [Development Guide](docs/development.md) - Detailed development setup and workflows
- [Git Workflow](docs/git-workflow.md) - Git conventions and branch strategy
- [CI/CD Documentation](docs/cicd.md) - GitHub Actions workflows and deployment
