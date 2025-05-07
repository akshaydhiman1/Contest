# Contest App Backend

This is the backend server for the Contest App, which provides APIs for managing contests and sending invitations.

## Structure

The backend is organized with the following directory structure:

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Business logic for routes
│   ├── models/         # Database models
│   └── routes/         # API routes
├── package.json        # Node.js dependencies and scripts
└── README.md           # This file
```

## Models

- **User**: Handles user accounts and authentication
- **Contest**: Manages contest data, including images and voting duration
- **Invitation**: Handles invitations to participate in contests

## Features

- **Authentication**: User registration and login (simulated in the current version)
- **Contest Management**: Create, read, update, and delete contests
- **Invitation System**: 
  - Send invitations via different methods (app, WhatsApp, SMS, etc.)
  - Accept/decline invitations
  - Track invitation status
  - Bulk invitation sending

## API Endpoints

### Invitations

- `POST /api/invitations`: Create a new invitation
- `GET /api/invitations/contest/:contestId`: Get all invitations for a specific contest
- `GET /api/invitations/received`: Get all invitations received by the logged-in user
- `GET /api/invitations/sent`: Get all invitations sent by the logged-in user
- `PUT /api/invitations/:id/respond`: Respond to an invitation (accept/decline)
- `DELETE /api/invitations/:id`: Cancel an invitation
- `POST /api/invitations/bulk`: Send bulk invitations

### Contests

- `POST /api/contests`: Create a new contest
- `GET /api/contests`: Get all contests
- `GET /api/contests/:id`: Get a specific contest
- `PUT /api/contests/:id`: Update a contest
- `DELETE /api/contests/:id`: Delete a contest
- `GET /api/contests/user/created`: Get contests created by the logged-in user
- `GET /api/contests/user/participating`: Get contests in which the logged-in user is participating

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the `src/config` directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   ```
   
   Note: The database name "contest-app" will be automatically appended to the MongoDB URI.

3. Seed the database with test data:
   ```
   npm run seed
   ```
   This will populate the database with realistic test data for contests, users, and invitations.

4. Run the server:
   ```
   npm run dev
   ```

## Integration with Frontend

The backend APIs are designed to work with the Contest App React Native frontend. 
The invitation system supports multiple invitation methods as shown in the frontend UI:

- App Users: Invite users registered in the app
- WhatsApp: Invite users via WhatsApp
- Text Message: Invite users via SMS
- Other: Other sharing methods

## Future Improvements

- Implement complete user authentication with JWT
- Add email verification
- Implement voting system for contests
- Add image upload functionality
- Create notification system for invitation events
- Implement real-time updates using WebSockets
