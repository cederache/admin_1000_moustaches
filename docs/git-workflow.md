# Git Workflow and Configuration

This document describes the Git workflow, commit conventions, and tools used in the Admin 1000 Moustaches project.

## Initial Setup

### Important: Configure Git Hooks

Before developing, run this command after cloning the project:

```bash
git config core.hooksPath .githooks
```

This ensures that the project's custom Git hooks are properly configured.

## GitLint Setup

### Installation

Install GitLint using Homebrew:

```bash
brew install gitlint
```

### Configuration

1. Install the Git hook in your repository root folder:

```bash
gitlint install-hook
```

2. Ensure you have a `.gitlint` file in the root folder of your repository:

```ini
[general]
ignore=B6
contrib=contrib-title-conventional-commits
```

## Commit Message Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Commit Types

| Type | Description |
|------|-------------|
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `feat` | New feature or task related to a feature |
| `style` | Changes that do not affect the meaning of the code (whitespace, formatting, missing semi-colons, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding missing tests or correcting existing tests |
| `build` | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm) |
| `ci` | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Examples

```bash
# Feature addition
git commit -m "feat: add user authentication system"

# Bug fix
git commit -m "fix: resolve login validation issue"

# Documentation update
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: simplify user service logic"
```

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Branch Strategy

### Main Branches

- `main`: Production-ready code
- `develop`: Integration branch for features

### Supporting Branches

- `feature/*`: New features (branch from `develop`, merge back to `develop`)
- `release/*`: Release preparation (branch from `develop`, merge to `main` and `develop`)
- `hotfix/*`: Emergency fixes (branch from `main`, merge to `main` and `develop`)

### CI/CD Integration

- **Tests**: Automated tests run on pull requests from `release/*` or `hotfix/*` branches to `main`
- **Deployment**: Automatic deployment occurs when pushing to `main` branch
- **Manual Deployment**: Available via workflow dispatch for emergency situations

## Best Practices

1. **Always use descriptive commit messages** following the conventional commits format
2. **Keep commits atomic** - each commit should represent a single logical change
3. **Use branches** for all development work
4. **Write meaningful branch names** that describe the work being done
5. **Test your changes** locally before pushing
6. **Use pull requests** for code review before merging to main branches

## Tools Integration

### GitLint
- Automatically validates commit messages
- Enforces conventional commits format
- Runs as a Git hook on commit

### GitHub Actions
- Triggers CI/CD pipelines based on branch names and changes
- Validates code quality and runs tests
- Deploys to production environment
