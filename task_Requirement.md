# Task Checklist for Backend Developer

## Setup and Initial Configuration
- [X] **Set Up Project Repository**
    - Create a new project repository on GitHub or another version control platform.
    - Initialize the project with `npm init` and create a basic project structure.

- [X] **Install Dependencies**
    - Install necessary packages: `express`, `pg`, `jsonwebtoken`, `bcrypt`, `dotenv`, `supertest`, `jest`, etc.
    - Configure the environment variables using a `.env` file.

## Database Configuration
- [ ] **Set Up PostgreSQL Database**
    - Create a new PostgreSQL database for the project.
    - Create tables for `users` and `organisations` based on the specified schemas.

- [ ] **Database Connection**
    - Set up a database connection using a PostgreSQL client (e.g., `pg`).
    - Ensure the connection string is correctly set in the `.env` file.

## Models and Migrations
- [ ] **User Model**
    - Create a User model with the following fields: `userId`, `firstName`, `lastName`, `email`, `password`, `phone`.
    - Ensure `userId` and `email` are unique.
    - Implement validations for all fields.

- [ ] **Organisation Model**
    - Create an Organisation model with the following fields: `orgId`, `name`, `description`.
    - Ensure `orgId` is unique.
    - Implement validations for all fields.

## User Authentication
- [ ] **User Registration Endpoint**
    - Create a POST `/auth/register` endpoint.
    - Implement password hashing using `bcrypt`.
    - Generate JWT token for the registered user.
    - Ensure a default organisation is created for the user upon registration.
    - Return appropriate responses for success and failure cases.

- [ ] **User Login Endpoint**
    - Create a POST `/auth/login` endpoint.
    - Implement user authentication using email and password.
    - Generate JWT token for the logged-in user.
    - Return appropriate responses for success and failure cases.

## Organisation Management
- [ ] **Get User Record Endpoint**
    - Create a GET `/api/users/:id` endpoint to fetch user details.
    - Ensure only the user or members of the organisation can access the record.
    - Return appropriate responses for success and failure cases.

- [x] **Get All Organisations Endpoint**
    - Create a GET `/api/organisations` endpoint to fetch all organisations the user belongs to or created.
    - Ensure only the logged-in user can access their organisations.
    - Return appropriate responses for success and failure cases.

- [ ] **Get Single Organisation Endpoint**
    - Create a GET `/api/organisations/:orgId` endpoint to fetch a single organisation record.
    - Ensure only the user or members of the organisation can access the record.
    - Return appropriate responses for success and failure cases.

- [ ] **Create Organisation Endpoint**
    - Create a POST `/api/organisations` endpoint to create a new organisation.
    - Validate the request body.
    - Return appropriate responses for success and failure cases.

- [ ] **Add User to Organisation Endpoint**
    - Create a POST `/api/organisations/:orgId/users` endpoint to add a user to a particular organisation.
    - Validate the request body.
    - Return appropriate responses for success and failure cases.

## Testing
- [ ] **Set Up Testing Environment**
    - Configure Jest for testing.
    - Create a `tests` directory for storing test files.

- [ ] **Write Unit Tests**
    - Write unit tests for token generation, ensuring token expiration and user details are correct.
    - Write unit tests to ensure users can't see data from organisations they don't have access to.

- [ ] **Write End-to-End Tests for Registration Endpoint**
    - Create `tests/auth.spec.js` (or `.ts` if using TypeScript) to test the `/auth/register` endpoint.
    - Cover successful registration, validation errors, and duplicate email scenarios.

- [ ] **Write End-to-End Tests for Login Endpoint**
    - Add tests to `tests/auth.spec.js` to test the `/auth/login` endpoint.
    - Cover successful login and invalid credentials scenarios.

## Deployment
- [ ] **Deploy to Hosting Service**
    - Choose a free hosting service (e.g., Vercel, Heroku).
    - Configure the deployment settings and environment variables.
    - Deploy the application.

## Submission
- [ ] **Verify Endpoint Functionality**
    - Ensure all endpoints are functioning correctly.
    - Double-check all responses and error handling.

- [ ] **Submit the Endpoint's Base URL**
    - Provide the hosted page's URL in the designated submission form.
    - Review the submission to ensure all requirements and acceptance criteria are met.
