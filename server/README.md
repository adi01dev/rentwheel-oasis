
# RentWheel Backend

This is the backend server for the RentWheel car rental platform.

## Setup

1. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE rentwheel;
\c rentwheel
```

2. Copy the .env.example file to .env and fill in your database credentials:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
npm install
```

4. Run the database schema:
```bash
psql -U postgres -d rentwheel -f ./src/db/schema.sql
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user

### Cars
- GET /api/cars - Get all available cars
- GET /api/cars/:id - Get car by ID
- GET /api/cars/search?location={location} - Search cars by location
- GET /api/cars/host/:hostId - Get cars by host ID
- POST /api/cars - Add a new car (host only)
- PUT /api/cars/:id - Update a car (host only)
- DELETE /api/cars/:id - Delete a car (host only)

### Bookings
- POST /api/bookings - Create a new booking
- GET /api/bookings/user/:userId - Get user's bookings
- GET /api/bookings/car/:carId - Get car's bookings (host only)
- PATCH /api/bookings/:id - Update booking status

## Production Deployment

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```
