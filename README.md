# Team Availability Tracker

Simple tracker with a backend API for persistence.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser.

## API

- `GET /api/team` - returns member list and availability
- `PUT /api/availability` - save full availability state
- `PATCH /api/availability/:id` - toggle or update a single member
