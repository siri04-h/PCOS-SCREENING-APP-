Since your Lunara PCOS Screening App is working now, add these steps to your README.md so anyone can run the project after cloning it.

# PCOS Screening App (Lunara)

AI-powered PCOS screening and menstrual wellness application built with React Native (Expo), Node.js, MongoDB, and FastAPI (Python ML Service).

## Tech Stack

* React Native (Expo)

* Node.js + Express

* MongoDB Atlas

* FastAPI

* Python (XGBoost, SHAP, Transformers)

## Project Structure

```
PCOS-SCREENING-APP/
├── backend/
├── ml-service/
├── src/
├── assets/
└── App.js
```

## Prerequisites

Install:

* Node.js

* Python 3.10+

* Git

* Expo Go (optional for mobile)

## Clone Repository

Bash

```
git clone https://github.com/siri04-h/PCOS-SCREENING-APP-.git
cd PCOS-SCREENING-APP
```

## Environment Variables

Create `backend/.env`.

env

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://127.0.0.1:8000
```

> `.env` is intentionally not included in the repository.

## Install Dependencies

### Frontend

Bash

```
npm install
```

### Backend

Bash

```
cd backend
npm install
```

### ML Service

Bash

```
cd ../ml-service

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
pip install shap transformers deepface xgboost
```

## Run the Project

Open three terminals.

### Terminal 1 – ML Service

Bash

```
cd ml-service
venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:

```
Application startup complete.
```

### Terminal 2 – Backend

Bash

```
cd backend
npm start
```

Expected output:

```
MongoDB connected successfully
Lunara backend running on port 5000
```

### Terminal 3 – Frontend

Bash

```
npm start
```

Then:

* Press w to open in Chrome.

* Or scan the QR code using Expo Go.

## Features

* User authentication

* Daily wellness check-ins

* Cycle calendar and history

* Progress analytics

* AI-based PCOS risk screening

* Personalized recommendations

* Emotion tracking

* Doctor report sharing

## Notes

* Start the ML Service before the backend.

* Keep both backend (port 5000) and ML Service (port 8000) running while using the app.

* MongoDB Atlas must be accessible through the connection string in `.env`.

This README is suitable for your GitHub project and clearly explains how to run all three parts of the application.
