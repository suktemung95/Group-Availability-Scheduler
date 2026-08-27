# Group Availability Tracker

A full-stack scheduling platform that helps users manage weekly availability, create groups, invite members, and automatically determine overlapping free time between group members.

The application is designed to simplify group scheduling by replacing manual availability comparisons with a centralized system that calculates shared free time automatically.

## Features

- User registration and authentication
- JWT-based protected routes
- Weekly availability management
- Free and unavailable time blocks
- Group creation and membership management
- Group invitation system
- Membership verification
- Automatic shared-availability calculations
- Calendar-based schedule visualization
- Group overlap results
- Personalized dashboard statistics
- Responsive frontend interface
- Persistent PostgreSQL storage
- Automated backend testing
- CI pipeline for validating changes

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- RESTful API architecture
- JWT authentication
- bcrypt password hashing

### Database

- PostgreSQL
- Supabase
- Relational database design
- Parameterized SQL queries
- Database migrations

### Testing

- Vitest
- Automated backend tests
- Dedicated test database

### DevOps / Infrastructure

- Docker
- GitHub Actions
- Continuous Integration
- Environment-based configuration

---

## Architecture

The application follows a traditional three-layer full-stack architecture:

```text
React Frontend
      |
      | HTTP / REST
      v
Express.js API
      |
      | SQL Queries
      v
PostgreSQL / Supabase
```

### Frontend

The React frontend handles:

- Authentication interfaces
- User dashboards
- Weekly schedule management
- Group creation and management
- Invitation handling
- Calendar visualization
- Availability overlap results

The frontend communicates with the backend using REST API requests.

### Backend

The Express.js server contains the application's main business logic, including:

- Authentication
- User authorization
- Schedule operations
- Group management
- Invitations
- Membership verification
- Availability calculations

Protected endpoints require a valid JWT before accessing user-specific resources.

### Database

PostgreSQL stores persistent application data such as:

- Users
- Schedules
- Availability blocks
- Groups
- Group memberships
- Invitations

Relational joins are used to connect users with groups, invitations, and schedules.

---

## How It Works

### 1. Create an Account

Users register an account and authenticate through the backend API.

Passwords are hashed before being stored in the database.

After successful login, the server returns a JSON Web Token used to authenticate future requests.

### 2. Create a Schedule

Users define their weekly availability by creating schedule blocks for specific days and times.

Each schedule block represents a period during which the user is available or unavailable.

### 3. Create or Join Groups

Users can create groups and invite other users to join them.

Group membership is stored in the database and verified before users can access group-specific operations.

### 4. Compare Availability

The backend retrieves the schedules of members within a group and calculates time periods where their availability overlaps.

The resulting shared availability is returned to the frontend and displayed through the application's calendar interface.

---

## Authentication

The application uses JWT-based authentication.

After logging in, the client receives a token that is included with requests to protected API routes.

Example:

```http
Authorization: Bearer <token>
```

Authentication middleware verifies the token before allowing access to protected resources.

Passwords are hashed using bcrypt and are never stored as plaintext.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL or access to a Supabase PostgreSQL database
- Git
- Docker, if running the test database locally

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd <project-directory>
```

Install backend dependencies:

```bash
npm install
```

If the frontend is stored in a separate directory, navigate into it and install its dependencies:

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file for local development.

The application requires environment variables for configuration such as:

```env
DATABASE_URL=<your-database-connection-string>
JWT_SECRET=<your-jwt-secret>
```

Depending on the environment, additional variables may be required for database or test configuration.

For testing, the project may also use variables such as:

```env
NODE_ENV=test
IS_TEST_DATABASE=true
```

Do not commit `.env` files or real credentials to version control.

---

## Running Locally

Start the backend server:

```bash
npm run dev
```

Start the frontend development server from the frontend directory:

```bash
npm run dev
```

After both services are running, open the frontend URL provided by Vite in your browser.

---

## API Overview

The backend exposes RESTful endpoints organized by resource.

### Authentication

Authentication endpoints handle user registration and login.

Typical operations include:

```text
POST /auth/register
POST /auth/login
```

### Users

User endpoints provide access to authenticated user information.

```text
GET /users/me
```

### Schedule

Schedule endpoints allow authenticated users to manage their availability.

```text
GET    /schedule
POST   /schedule
PUT    /schedule/:id
DELETE /schedule/:id
```

### Groups

Group endpoints manage group creation and membership.

```text
POST /groups
GET  /groups/list
```

Additional group operations handle membership verification and group-specific data.

### Invitations

Invitation endpoints allow users to send, receive, accept, or reject group invitations.

```text
GET /invites/list
```

### Availability Overlap

The backend calculates overlapping availability between authenticated users who share membership in a group.

The calculation compares stored schedule intervals and determines shared periods of availability.

---

## Availability Calculation

One of the core features of the application is automatic availability comparison.

Instead of requiring users to manually inspect multiple calendars, the backend:

1. Retrieves relevant group members.
2. Loads each member's availability.
3. Groups schedules by day.
4. Compares time intervals.
5. Determines periods where the required users are simultaneously available.
6. Returns those intervals to the frontend.

The frontend then visualizes the resulting overlap through the group scheduling interface.

---

## Database Design

The application uses PostgreSQL as its relational database.

The schema is structured around several primary entities.

### Users

Stores account information and authentication-related data.

### Schedules

Stores user availability blocks, including:

- User
- Day of week
- Start time
- End time
- Block type

### Groups

Stores groups created by users.

### Group Memberships

Represents the many-to-many relationship between users and groups.

A user can belong to multiple groups, and each group can contain multiple users.

### Invitations

Stores pending group invitations and their relationships to users and groups.

### Relationships

Conceptually, the schema follows relationships similar to:

```text
Users
  |
  | 1:N
  v
Schedules

Users
  |
  | N:M
  v
Groups
  |
  v
Group Memberships

Users
  |
  v
Invitations
  |
  v
Groups
```

Parameterized SQL queries are used when interacting with PostgreSQL to avoid directly inserting user-controlled values into SQL statements.

---

## Frontend Dashboard

The frontend dashboard provides users with a centralized view of their scheduling information.

Dashboard functionality includes:

- Schedule blocks
- Groups
- Pending invitations
- Total free time
- Daily free-time statistics
- Best available day
- Weekly schedule visualization

Separate views provide interfaces for:

- Schedule management
- Groups
- Invitations
- Availability comparison

---

## Testing

The project uses Vitest for automated testing.

Tests are designed to validate backend behavior and prevent regressions as new features are added.

Run the test suite with:

```bash
npm test
```

The test environment is separated from the production database to prevent test operations from modifying real application data.

A dedicated PostgreSQL test database can be run through Docker.

---

## Docker

Docker is used to provide a consistent PostgreSQL environment for testing.

This allows tests to run against a predictable database configuration without depending on a developer's local PostgreSQL installation.

A typical development workflow is:

```text
Start test database
        |
        v
Apply database schema / migrations
        |
        v
Run automated tests
        |
        v
Stop or reset test database
```

This approach also helps keep local development and CI environments consistent.

---

## Continuous Integration

The repository uses GitHub Actions for Continuous Integration.

When code is pushed or a pull request is opened, the CI workflow can automatically:

1. Check out the repository.
2. Configure the Node.js environment.
3. Install dependencies.
4. Configure the test environment.
5. Start required services or databases.
6. Run automated tests.
7. Report whether the build passes or fails.

This helps detect breaking changes before they are merged into the main branch.

---

## Project Structure

The exact structure may vary as the application develops, but the repository generally separates frontend and backend responsibilities.

```text
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── database/
│   ├── tests/
│   └── ...
│
├── migrations/
│
├── .github/
│   └── workflows/
│
├── .env.example
├── package.json
└── README.md
```

---

## Engineering Highlights

This project was built to go beyond basic CRUD functionality and explore several concepts used in production backend systems.

Key engineering areas include:

- REST API design
- Authentication and authorization
- Relational database modeling
- SQL joins
- Parameterized queries
- Many-to-many relationships
- Middleware
- Protected resources
- Time-interval algorithms
- Frontend/backend integration
- Automated testing
- Database isolation for tests
- Dockerized infrastructure
- Continuous Integration
- Environment configuration

---

## Security

Several practices are used to improve application security:

- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Server-side authorization checks
- Group membership verification
- Parameterized database queries
- Environment variables for secrets
- Separation of test and production databases

Secrets such as database credentials and JWT signing keys should never be committed to the repository.

---

## Future Improvements

Potential improvements include:

- Improved test coverage
- End-to-end testing
- More advanced group scheduling options
- Recurring schedule templates
- Automatic meeting-time recommendations
- Time-zone support
- Calendar integrations
- Email or application notifications
- Improved mobile responsiveness
- Performance improvements for large groups
- Redis caching for frequently requested availability calculations
- Background jobs for notifications
- Production deployment
- Logging and monitoring
- Rate limiting
- Refresh-token authentication
- More granular user and group permissions

---

## Purpose

This project was created as a full-stack software engineering project focused particularly on backend development.

The primary goals were to gain practical experience with:

- Designing RESTful APIs
- Building authentication systems
- Modeling relational data
- Writing SQL queries
- Implementing application-level authorization
- Solving scheduling and interval-overlap problems
- Connecting a React frontend to a backend API
- Writing automated tests
- Using Docker for reproducible environments
- Building CI workflows with GitHub Actions

---

## License

This project is currently intended for educational and portfolio purposes.

Add a license here if the project is later distributed or made available for external use.
