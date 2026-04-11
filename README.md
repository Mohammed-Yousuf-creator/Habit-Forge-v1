# HabitForge

HabitForge is a React + Firebase habit tracking web app focused on fast daily logging.
Users can sign up, create habits with weekly schedules, mark completion in one tap, and track streaks over time.

## Features

- Email/password authentication with Firebase Auth
- Google sign-in support
- Protected habit dashboard routes for authenticated users
- Create, update, and delete habits
- Multi-day weekly scheduling for each habit
- One-tap daily check-in on scheduled days
- Automatic streak calculation based on schedule + history
- Friendly error handling for auth and Firestore actions

## Tech Stack

- React 19
- React Router
- Vite
- Firebase Authentication
- Cloud Firestore
- React Select
- React Icons
- ESLint

## Project Structure

```
Hack-Forge-v1/
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ index.css
│  ├─ protectedRoute.jsx
│  ├─ Context/
│  │  └─ authcontext.jsx
│  └─ components/
│     ├─ landingpage.jsx
│     ├─ Login.jsx
│     ├─ SignUp.jsx
│     ├─ Habits.jsx
│     ├─ MakeHabit.jsx
│     ├─ UpdateHabit.jsx
│     ├─ Card.jsx
│     ├─ StreakCalculator.js
│     ├─ AppErrorBoundary.jsx
│     └─ NotFound.jsx
├─ firebaseConfig.js
├─ firebaseFunction.js
├─ vite.config.js
└─ package.json
```

## Routes

- `/` - Landing page
- `/login` - Login page
- `/signup` - Sign-up page
- `/habits` - Habit dashboard (protected)
- `/habit/new` - Create habit (protected)
- `/habit/update/:id` - Update habit (protected)

## Data Model (Firestore)

Habits are stored per user using this path pattern:

`users/{userId}/habits/{habitId}`

Each habit document contains:

- `title` (string)
- `description` (string)
- `schedule` (string[])
- `history` (Timestamp[])
- `dateAdded` (Timestamp)
- `LastUpdated` (Timestamp)

### Prerequisites

- Node.js 20+
- npm
- A Firebase project with Authentication and Firestore enabled

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Hack-Forge-v1
npm install
```

### 2. Configure Firebase

Update the Firebase config values in `firebaseConfig.js` with your own Firebase project settings:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Then ensure:

- Email/Password sign-in is enabled in Firebase Authentication
- Google sign-in is enabled in Firebase Authentication (if using Google login)
- Firestore database is created

### 3. Run locally

```bash
npm run dev
```

App runs at the local Vite URL shown in your terminal (typically `http://localhost:5173`).

## Security Note

Firebase API keys are not private secrets by themselves, but you should still:

- Use your own Firebase project values
- Restrict authorized domains in Firebase Auth
- Configure Firestore security rules to require authenticated user access to their own data

## Future Improvements

- Move Firebase config to environment variables (`.env`)
- Add unit and integration tests
- Add habit analytics and progress charts
- Add reminders and notifications

## License

No license is currently specified.