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

### 🔐 Security & Account Features
- **Robust Authentication**: JWT-based secure login system.
- **OTP Password Reset**: 6-digit OTP verification system via Brevo SMTP.
- **Strong Password Policy**: Enforced complexity requirements (8+ chars, Uppercase, Lowercase, Number, Special Symbol).
- **Input Validation**: Real-time single-line feedback for better user experience.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js, Nodemailer
- **Email Service**: Brevo (formerly Sendinblue) SMTP
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io for instant updates
- **Auth**: JSON Web Tokens (JWT) & Bcryptjs
- **Containerization**: Docker & Docker Compose

---

## 🏁 Getting Started

### 🐋 Method 1: Docker (Fastest & Secure)
1.  **Install Docker Desktop**.
2.  **Create a `.env` file** in the root directory and add your secrets (see template below).
3.  **Run**:
    ```bash
    docker-compose up --build
    ```
4.  **Access**: `http://localhost`


### � Environment Variables Template
Create a `.env` file in the root directory:
```env
PORT=5002
MONGODB_URI=mongodb://mongodb:27017/collegesphere
JWT_SECRET=your_jwt_secret
NODE_ENV=production
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_user
SMTP_PASS=your_brevo_pass
FROM_NAME=CollegeSphere
FROM_EMAIL=your_email@gmail.com
```

### �🛠️ Method 2: Manual Setup
Follow these steps to set up the project locally.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/vishalkayande/CollegeSphere.git
cd CollegeSphere
```

### 2️⃣ Backend Setup
Open a terminal in the `backend` folder:
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

# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
FROM_NAME=CollegeSphere
FROM_EMAIL=your_verified_sender_email
```

### 3️⃣ Frontend Setup
Open a new terminal in the `frontend` folder:
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

For a detailed walkthrough of deploying on AWS EC2 using Docker, see the [DEPLOYMENT_GUIDE.md](file:///d:/CollegeSphere/DEPLOYMENT_GUIDE.md).

### Quick Docker Deployment (EC2)
1.  **Clone** repo to EC2.
2.  **Create `.env`** file in the root directory with production values.
3.  **Run**: `sudo docker-compose up -d --build`.

---

## 📜 License
This project is licensed under the ISC License.

