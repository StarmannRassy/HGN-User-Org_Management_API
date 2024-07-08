# User Authentication and Organisation Management API

This project is a user authentication and organisation management API built using Node.js and Express. It connects to a PostgreSQL database and provides endpoints for user registration, login, and organisation management.

## Features

- **User Registration**: Register new users and create a default organisation for them.
- **User Login**: Authenticate users and provide JWT tokens for accessing protected endpoints.
- **User Management**: Fetch user details and ensure users can only access their own data.
- **Organisation Management**: Create and manage organisations, ensuring users can only access organisations they belong to.
- **Protected Endpoints**: Secure endpoints with JWT token authentication.
- **Validation**: Validate all input fields and handle errors appropriately.
- **Testing**: Unit and end-to-end tests for ensuring the functionality of endpoints.

## Endpoints

### User Authentication

#### Register a User
POST /auth/register

### Request Body:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
Response:
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJh...",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    }
  }
}
```

#### Login a User
POST /auth/login

Request Body:
```json
{
  "email": "string",
  "password": "string"
}
Response:
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJh...",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    }
  }
}
```

### User Management
#### Get User Record
GET /api/users/:id
Response:
```json
{
"status": "success",
"message": "User retrieved successfully",
"data": {
"userId": "string",
"firstName": "string",
"lastName": "string",
"email": "string",
"phone": "string"
}
}
```

## Organisation Management
### Get All Organisations
GET /api/organisations

Response:
```json
{
"status": "success",
"message": "Organisations retrieved successfully",
"data": {
"organisations": [
{
"orgId": "string",
"name": "string",
"description": "string"
}
]
}
}
```

### Get Single Organisation
GET /api/organisations/:orgId

Response:
```json
{
"status": "success",
"message": "Organisation retrieved successfully",
"data": {
"orgId": "string",
"name": "string",
"description": "string"
}
}
```

### Create Organisation
POST /api/organisations

Request Body:
```json
{
"name": "string",
"description": "string"
}
Response
{
"status": "success",
"message": "Organisation created successfully",
"data": {
"orgId": "string",
"name": "string",
"description": "string"
}
}
```

### Add User to Organisation
POST /api/organisations/:orgId/users

Request Body:
```json
{
"userId": "string"
}
Response:
{
"status": "success",
"message": "User added to organisation successfully"
}
```

### Getting Started
#### Prerequisites
Node.js
PostgreSQL
npm

Installation
Clone the repository:
##### git clone https://github.com/your-username/your-repo.git
##### cd your-repo

Install dependencies:
##### npm install
Set up environment variables:

Create a .env file in the root directory.

Add the following variables:
###### DATABASE_URL=your_database_url
###### JWT_SECRET=your_jwt_secret

Run migrations to set up the database:
##### npx sequelize-cli db:migrate
Running the Server

Start the development server:
##### npm start
The server will run on http://localhost:3000.

Testing
Run the tests:
##### npm test

### Deployment
Choose a hosting service (e.g., Vercel, Heroku).
Configure the deployment settings and environment variables.
Deploy the application.

### Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any changes.

### License
This project is licensed under the MIT License.

### Acknowledgments
Thanks to the HNG Internship program for the opportunity to work on this project.

This `README.md` file provides a comprehensive guide to setting up, using, and contributing to the 
