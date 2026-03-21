# SynergySphere  

⚡ **SynergySphere** is a full-stack collaboration platform (Next.js + Node.js + PostgreSQL).  
It provides authentication, project management, team collaboration, communication, and progress tracking.  

---

## 🛠 Tech Stack

- **Frontend:** Next.js (React, TailwindCSS, ShadCN UI)
- **Backend:** Node.js (Express.js, PostgreSQL with `pg`)
- **Database:** PostgreSQL (Dockerized)
- **Containerization:** Docker + Docker Compose

---

## 📂 Project Structure

SynergySphere/
├── backend/ # Node.js + Express backend
│ ├── src/ # API source code
│ ├── package.json
│ └── .env # Backend environment variables
├── frontend/ # Next.js frontend
│ ├── app/ # Next.js app routes
│ ├── components/ # UI components
│ ├── package.json
│ └── .env.local # Frontend environment variables
├── docker-compose.yml
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/yourusername/synergysphere.git
cd SynergySphere
Backend (backend/.env)
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hackdb
PORT=8000

Frontend (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

3️⃣ Run with Docker (Recommended)
docker-compose up --build


Backend → http://localhost:8000

Frontend → http://localhost:3000

Postgres DB → localhost:5432 (user: postgres, password: postgres, db: hackdb)

4️⃣ Run Locally without Docker (Optional)
Start PostgreSQL manually

(make sure DB hackdb exists and credentials match .env)

Start Backend
cd backend
npm install
npm run dev

Start Frontend
cd frontend
npm install
npm run dev

🚀 Features

🔑 User Authentication (Sign Up / Sign In)

📊 Project Management

👥 Team Collaboration

💬 Communication with threads

📈 Progress Tracking

🧪 Testing

Backend:

cd backend
npm test


Frontend:

cd frontend
npm run lint

📜 License

MIT License © 2025

👨‍💻 Contributors

You 🚀

Your team


---'''