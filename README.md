# 🎓 CollegeSphere

CollegeSphere is a comprehensive academic event management platform designed to streamline event coordination within educational institutions. It provides dedicated interfaces for Students, Organizers, and Administrators to manage everything from event discovery to registration and results.

## 🚀 Key Features

### 👨‍🎓 Student Features
- **Event Discovery**: Browse events by level (Department, Institute, Club).
- **Smart Sorting**: Events are prioritized by status (Live > Registered > Completed > Closed).
- **Registration System**: One-click enrollment with confirmation popups.
- **Flexibility**: Ability to unregister from events before deadlines.
- **Leaderboards**: View winners and rankings for completed events.

### 🏢 Organizer Features
- **Unified Dashboard**: Admin-style home page with specialized tools.
- **Event Management**: Create and manage events with detailed information.
- **Participant Visibility**: Real-time tracking of student registrations.
- **Status Control**: Automatic event lifecycle management (Live/Closed).

### 🔑 Admin Features
- **Global Oversight**: Command center for all campus activities and users.
- **Transparency**: Detailed event cards showing creation dates, deadlines, and organizer info.
- **Approval System**: Manage and approve organizer account requests.
- **Data Export**: Download registration lists in CSV format for offline processing.
- **Full Control**: Ability to moderate events and users across all colleges.

## 🛡️ Security Features
- **Robust Authentication**: JWT-based secure login system.
- **Strong Password Policy**: Enforced complexity requirements (8+ chars, Uppercase, Lowercase, Number, Special Symbol).
- **Input Validation**: Real-time single-line feedback for better user experience.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io for instant updates
- **Auth**: JSON Web Tokens (JWT) & Bcryptjs

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/CollegeSphere.git
cd CollegeSphere
```

### 2️⃣ Backend Setup
Open a terminal in the root directory:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add:
```env
PORT=5002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Frontend Setup
Open a new terminal in the root directory:
```bash
cd frontend
npm install
```

### 4️⃣ Run the Application
**Start Backend:**
```bash
cd backend
npm run dev
```
**Start Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🚢 Deployment Steps

To make the application live on a platform like Vercel (Frontend) and Render/Railway (Backend):

### Backend Deployment
1. Connect your GitHub repo to the hosting platform.
2. Set the build command to `npm install`.
3. Set the start command to `node server.js`.
4. **Important**: Add all `.env` variables in the platform's Environment Variables section.

### Frontend Deployment
1. Connect the repo and set the framework preset to **Vite**.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Set the environment variable `VITE_API_URL` to your deployed backend URL.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License
This project is licensed under the ISC License.

