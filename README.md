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
- Node.js 20
- Docker and Docker Compose
- Git

### Recommended Setup (Docker)

1. **Clone and configure**
   ```bash
   git clone <repository-url>
   cd admin_1000_moustaches
   git config core.hooksPath .githooks
   ```

2. **Create environment file**
   ```bash
   # Create .env.local with your configuration
   cp .env.example .env.local  # if available
   ```

3. **Start the application**
   ```bash
   npm run start:fresh
   ```

### Development Mode

For active development with hot reload:

```bash
# Start database only
npm run start:fresh:database-only

# In separate terminals:
cd server && npm run dev          # Start server
cd server && npm run dev:fixtures # Load test data
cd front && npm run start:dev     # Start frontend
```

## 🏗️ Architecture

- **Frontend** (`/front`): React.js with Vite
- **Backend** (`/server`): Node.js Express with TypeScript
- **Database**: MySQL (containerized)
- **Deployment**: Firebase Hosting (frontend) + Firebase Functions (backend)

## 🛠️ Key Commands

| Command | Description |
|---------|-------------|
| `npm run start:fresh` | Fresh start with clean database |
| `npm run start:fresh:fixtures` | Start with test data |
| `npm run start:fresh:database-only` | Database only (for development) |
| `npm run restart:docker -- <service>` | Restart specific service |

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
