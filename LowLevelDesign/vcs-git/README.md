# VCS - Version Control System

A Git-like version control system built with Node.js and Express, designed with extensibility in mind.

## Features

- **init** - Initialize a new repository
- **add <regex>** - Add files matching regex pattern to staging area
- **commit (-m and -am)** - Commit staged changes with message
- **checkout {-b}** - Checkout or create a branch
- **reset HEAD~{int}** - Reset HEAD to a previous commit
- **status** - Show repository status
- **log** - Show commit history
- **diff** - Show differences between commits or working directory
- **help** - Show help information

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Initialize Repository
```bash
POST /api/vcs/init
```

### Add Files
```bash
POST /api/vcs/add
Content-Type: application/json

{
  "pattern": ".*\\.js$"
}
```

### Commit Changes
```bash
POST /api/vcs/commit
Content-Type: application/json

{
  "message": "Initial commit",
  "all": false  // true for -am flag (add and commit)
}
```

### Checkout Branch
```bash
POST /api/vcs/checkout
Content-Type: application/json

{
  "branch": "feature",
  "create": false  // true for -b flag (create new branch)
}
```

### Reset HEAD
```bash
POST /api/vcs/reset
Content-Type: application/json

{
  "offset": 1  // HEAD~1
}
```

### Get Status
```bash
GET /api/vcs/status
```

### Get Commit Log
```bash
GET /api/vcs/log?limit=50
```

### Get Diff
```bash
GET /api/vcs/diff
# or between two commits:
GET /api/vcs/diff?commit1=abc123&commit2=def456
```

### Get Help
```bash
GET /api/vcs/help
```

## Architecture

The system is designed with extensibility in mind:

- **Command Pattern**: Each operation is implemented as a route handler, making it easy to add new commands
- **Separation of Concerns**: Core repository logic is separated from API routes
- **Modular Design**: File operations, repository management, and API routes are in separate modules

## Repository Structure

```
.vcs/
├── objects/        # Commit, tree, and blob objects
├── refs/
│   └── heads/      # Branch references
├── HEAD            # Current commit hash
├── BRANCH          # Current branch name
├── index.json      # Staging area
└── config.json     # Repository configuration
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `REPO_PATH` - Repository root path (default: current working directory)
- `USER` - Author name for commits (default: 'unknown')

## Example Usage

### Using curl

```bash
# Initialize repository
curl -X POST http://localhost:3000/api/vcs/init

# Add all JavaScript files
curl -X POST http://localhost:3000/api/vcs/add \
  -H "Content-Type: application/json" \
  -d '{"pattern": ".*\\.js$"}'

# Commit changes
curl -X POST http://localhost:3000/api/vcs/commit \
  -H "Content-Type: application/json" \
  -d '{"message": "Initial commit"}'

# Check status
curl http://localhost:3000/api/vcs/status

# View commit log
curl http://localhost:3000/api/vcs/log

# Get help
curl http://localhost:3000/api/vcs/help
```

## Extensibility

To add new commands:

1. Add a new route handler in `src/routes/vcsRoutes.js`
2. Implement the command logic using the `Repository` and `FileOperations` classes
3. Add help documentation in the `/help` endpoint

The architecture supports easy extension without modifying core functionality.

