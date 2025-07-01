
# 🖼️ MyApp — Image Upload & Feedback System

This project is an image upload and prediction system using YOLO (You Only Look Once), combined with a feedback mechanism. It is designed to be deployed seamlessly using Docker Compose.

---

## 🚀 Features

✅ Upload images and detect objects using YOLO.  
✅ Show bounding boxes and prediction results.  
✅ Provide feedback on each predicted object.  
✅ Store feedback data in a PostgreSQL database.  
✅ Fully containerized with Docker Compose.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (TypeScript, Tailwind CSS)
- **Backend:** Flask (Python, YOLO)
- **Database:** PostgreSQL
- **Deployment:** Docker & Docker Compose

---

## 📁 Project Structure

```
├── client/          # Next.js frontend app
│   ├── pages/
│   ├── components/
│   ├── public/
│   └── ...
├── server/          # Flask backend API
│   ├── main.py
│   ├── models/
│   └── ...
├── docker-compose.yml
├── README.md
```
---

## 💻 Installation & Usage

### 1️⃣ Prerequisites

- Docker
- Docker Compose

---

### 2️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 3️⃣ Build and run with Docker Compose

```bash
docker-compose up --build
```

This command will:

- Build and start the frontend (Next.js) on **http://localhost:3000**
- Start the backend (Flask) on **http://localhost:5000**
- Start PostgreSQL database on **localhost:5432**

---

### 4️⃣ Access the app

Open your browser and go to:

```
http://localhost:3000
```

---

## ⚙️ Environment Variables

### Frontend

Set in `docker-compose.yml`:

```yaml
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> This is the URL where frontend will send API requests.

### Backend

Set in `docker-compose.yml`:

```yaml
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=myappdb
```

> Backend uses these to connect to the database.

---

## 🐳 Running locally without Docker (optional)

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
pip install -r requirements.txt
python main.py
```

### Database

- You can run a local PostgreSQL instance manually or use Docker.

---

## 🗄️ Database Configuration

Default credentials:

```
User: postgres
Password: postgres
Database: myappdb
Port: 5432
```

> You can change these in `docker-compose.yml`.

---

## ✅ Tips

- Make sure Docker is running before using `docker-compose up`.
- When using Docker Compose, containers can communicate internally using their service name (e.g., `db`, `backend`).
- If modifying code, rebuild using:
  ```bash
  docker-compose up --build
  ```

---

## 👨‍💻 Authors

- Trung Nguyen Thanh (trgn312@gmail.com)

---

🎉 **Happy coding!**
