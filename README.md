# EV Maintenance Training School

A web platform for training technicians in high-voltage EV maintenance. Students complete training modules, pass a graded assessment, earn a verifiable certificate, and book hands-on workshop lab sessions.

## Features
- 5 courses, each with a learning-outcomes overview, detailed lesson modules, and a final assessment (80% pass mark)
- Assessments unlock only after all modules are complete; retakes are allowed
- Certificates issued automatically on passing, with public verification by certificate ID
- Lab session booking and cancellation with limited seats
- Admin panel to create new lab sessions
- Light and dark mode

## Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express
- Storage: JSON file in `backend/data/` (created automatically, no database install needed)
- Security: JWT login tokens (7-day expiry), bcrypt password hashing, HMAC-signed certificates, rate limiting on login and sign-up

## Requirements
- Node.js version 18 or newer, from https://nodejs.org

## How to run
1. Open Terminal and go to the backend folder: `cd ev-training-school/backend`
2. Install the packages: `npm install`
3. Start the server: `npm start`
4. Open http://localhost:5050 in your browser

On the first run, the server creates `backend/.env` with random secrets. You do not need to edit it. If port 5050 is busy, change `PORT` in `backend/.env` and start again.

To stop the server, press Ctrl+C in the Terminal window.

## Demo accounts
- Admin: admin@evschool.com / Admin123!
- Students: register a new account from the home page

## Suggested test steps
1. Register a new student account.
2. Open a course, complete every module, and open the final assessment.
3. Submit the assessment with a score of 80% or more to receive a certificate.
4. Open the Certificates section and view the certificate.
5. Use the Verify Certificate page with the certificate ID.
6. Book a lab session, then cancel the booking.
7. Log in as admin and create a new lab session.

## Reset the data
Stop the server, delete `backend/data/db.json`, and start the server again. Student accounts and bookings are removed; the demo admin and lab sessions are recreated.

## Notes
- Lab sessions for the coming weeks are added automatically each time the server starts.
- Standards referenced in each course are listed in its overview. Check the current edition of each standard before relying on it.
- Course content is for training purposes and should be reviewed by a qualified high-voltage safety instructor before use in a real workshop.
- Do not share `backend/.env`. It contains private keys.