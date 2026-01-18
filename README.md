React Native mobile healthcare app that enables doctor-patient messaging, appointment scheduling, AI-powered health evaluations, and hospital location services. Built using React Native, Express.js, and MongoDB. First place winning project at Atomhacks X (40 teams, 150 competitors).

The application follows a client-server architecture with a React Native frontend communicating with a REST API backend. The backend serves protected routes with JWT middleware, stores user data and messaging history in MongoDB, and integrates external APIs including OpenAI API for health evaluations and third-party hospital location services.

**Pages:**
- `app/index.js`: Handles user login and registration with JWT token storage.
- `app/home/index.js`: Main dashboard displaying navigation to app features.
- `app/appointments/index.js`: Appointment scheduling and management interface.
- `app/messages/index.js`: Doctor-patient messaging interface.
- `app/ai-evaluation/index.js`: AI-powered symptom evaluation interface.
- `app/hospitals/index.js`: Hospital search and location interface.

**API Routes:**
- `POST /users/add`: User registration endpoint.
- `POST /users/login`: User authentication endpoint.
- `GET /appointments/get`: Retrieve user appointments.
- `POST /appointments/add`: Create new appointment.
- `GET /messages/get`: Retrieve message threads.
- `POST /messages/send`: Send message to doctor or patient.
- `POST /api/evaluate`: AI health evaluation endpoint using OpenAI API.
- `POST /api/hospitals`: Hospital location search endpoint.

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="frontend/assets/demo/Screenshot1.png" width="48%" />
  <img src="frontend/assets/demo/Screenshot2.png" width="48%" />
  <img src="frontend/assets/demo/Screenshot3.png" width="48%" />
  <img src="frontend/assets/demo/Screenshot4.png" width="48%" />
  <img src="frontend/assets/demo/Screenshot5.png" width="48%" />
  <img src="frontend/assets/demo/Screenshot6.png" width="48%" />
</div>