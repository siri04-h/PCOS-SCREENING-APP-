# Lunara — AI-Powered Women's Health and PCOS Wellness Platform

Lunara is a full-stack women's health and wellness platform designed to help users track menstrual cycles, symptoms, daily habits, emotional well-being, and PCOS-related risk indicators.

The platform combines a React Native mobile application, Node.js/Express backend, MongoDB database, and Python/FastAPI machine learning service.

Lunara is designed as a wellness and screening platform. AI-generated PCOS risk results are not intended to provide a medical diagnosis.

---

## 1. Project Overview

Lunara provides a unified platform for:

* User registration and authentication
* Health profile management
* Menstrual cycle tracking
* Period logging
* Symptom tracking
* Daily wellness check-ins
* Emotional well-being input
* PCOS risk screening using machine learning
* AI-generated contributing-factor explanations
* Personalized wellness recommendations
* Progress and analytics
* Historical PCOS screening results
* Secure communication between the mobile application, backend, database, and AI service

---

## 2. Team Responsibilities

### Member 1 — Mobile Application

Responsible for the complete React Native and Expo mobile application.

Responsibilities include:

* Authentication screens
* Registration and login
* Health profile onboarding
* Dashboard
* Menstrual cycle tracking
* Period logging
* Symptom tracking
* Daily wellness check-ins
* Emotion input interface
* PCOS risk result interface
* AI insights
* Recommendations
* Progress analytics
* Profile management
* Application navigation
* Frontend API integration
* Backend API communication

### Member 2 — AI/ML and Emotion Intelligence

Responsible for the artificial intelligence and machine learning components.

Responsibilities include:

* PCOS risk screening model
* Dataset preprocessing
* Feature engineering
* Machine learning model training
* XGBoost classification
* Model evaluation
* Model tuning
* PCOS prediction service
* FastAPI ML service
* PCOS probability prediction
* Risk-score generation
* Risk-level classification
* Feature contribution explanations
* SHAP-based explainability
* Emotion intelligence components
* AI service integration

### Member 3 — Backend, Database and Integration

Responsible for the server-side application, database, authentication, and integration between the mobile application and AI service.

Responsibilities include:

* Node.js backend
* Express REST APIs
* MongoDB database
* Mongoose data models
* User authentication
* JWT authorization
* Password hashing
* User management
* Cycle management
* Symptom management
* Daily check-ins
* Emotion records
* PCOS prediction records
* PCOS prediction history
* Backend-to-FastAPI communication
* Mobile-to-backend API integration

---

## 3. System Architecture

```text
                         LUNARA PLATFORM
                               |
              +----------------+----------------+
              |                                 |
              v                                 v
      React Native / Expo                 Node.js / Express
       Mobile Application                     Backend
              |                                 |
              | REST API                        |
              +-------------------------------> |
                                                |
                                  +-------------+-------------+
                                  |                           |
                                  v                           v
                              MongoDB                  FastAPI ML Service
                              Database                         |
                                                               v
                                                        XGBoost Model
                                                               |
                                                               v
                                                        PCOS Prediction
                                                               |
                                                               v
                                                         Risk Result
```

---

## 4. Main Data Flow

```text
                              USER
                                |
                                v
                   React Native Mobile App
                                |
                                | REST API
                                v
                    Node.js / Express Backend
                                |
                   +------------+------------+
                   |                         |
                   v                         v
               MongoDB                FastAPI ML Service
               Database                       |
                   |                           v
                   |                     XGBoost Model
                   |                           |
                   |                           v
                   |                    PCOS Probability
                   |                           |
                   |                           v
                   |                      Risk Level
                   |                           |
                   |                    Feature Explanations
                   |                           |
                   +-------------+-------------+
                                 |
                                 v
                       Node.js / Express Backend
                                 |
                                 v
                      React Native Mobile App
                                 |
                                 v
                         Display Result
```

### PCOS Screening Flow

```text
User Health Profile
        |
        v
Age + Height + Weight
Cycle Information
Symptoms
Family History
        |
        v
React Native Application
        |
        v
Node.js / Express Backend
        |
        v
FastAPI ML Service
        |
        v
Feature Engineering
        |
        v
Lunara XGBoost Model
        |
        v
PCOS Probability
        |
        +--------------------+
        |                    |
        v                    v
   Risk Score           Risk Level
        |              Low / Moderate / High
        |                    |
        +---------+----------+
                  |
                  v
        Feature Explanations
                  |
                  v
        Node.js Backend
                  |
                  v
        React Native App
                  |
                  v
        PCOS Risk Result Screen
```

---

## 5. Technology Stack

### Mobile Application

* React Native
* Expo
* JavaScript
* React Navigation
* Axios
* AsyncStorage
* Expo Camera
* Expo AV
* React Native SVG
* React Native Chart Kit

### Backend

* Node.js
* Express.js
* JavaScript
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Axios
* CORS
* dotenv

### AI/ML

* Python
* FastAPI
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Joblib
* SHAP

### Development Tools

* Visual Studio Code
* Git
* GitHub
* PowerShell
* npm
* pip
* Uvicorn
* Expo CLI

---

## 6. Project Structure

```text
LunaraApp/
|
+-- App.js
+-- app.json
+-- babel.config.js
+-- package.json
+-- README.md
|
+-- assets/
|   +-- icon.png
|
+-- src/
|   |
|   +-- api/
|   |   +-- authApi.js
|   |   +-- checkinApi.js
|   |   +-- cycleApi.js
|   |   +-- emotionApi.js
|   |   +-- mockData.js
|   |   +-- predictionApi.js
|   |   +-- client.js
|   |
|   +-- components/
|   |   +-- Input.js
|   |   +-- MoonPhase.js
|   |   +-- UI.js
|   |
|   +-- config.js
|   |
|   +-- context/
|   |   +-- AuthContext.js
|   |
|   +-- navigation/
|   |   +-- AuthNavigator.js
|   |   +-- MainTabNavigator.js
|   |   +-- RootNavigator.js
|   |
|   +-- screens/
|       |
|       +-- AI/
|       |   +-- AIInsightsScreen.js
|       |   +-- PCOSRiskResultScreen.js
|       |   +-- RecommendationsScreen.js
|       |
|       +-- Auth/
|       |   +-- LoginScreen.js
|       |   +-- RegisterScreen.js
|       |   +-- HealthProfileScreen.js
|       |
|       +-- Cycle/
|       |   +-- CycleCalendarScreen.js
|       |   +-- LogPeriodScreen.js
|       |
|       +-- DailyCheckIn/
|       |   +-- DailyCheckInScreen.js
|       |
|       +-- Emotion/
|       |   +-- EmotionInputScreen.js
|       |
|       +-- Home/
|       |   +-- DashboardScreen.js
|       |
|       +-- Profile/
|       |   +-- ProfileScreen.js
|       |
|       +-- Progress/
|       |   +-- ProgressAnalyticsScreen.js
|       |
|       +-- Symptoms/
|           +-- SymptomTrackingScreen.js
|       |
|       +-- theme/
|           +-- theme.js
|
+-- backend/
|   |
|   +-- package.json
|   +-- package-lock.json
|   +-- requirements.txt
|   |
|   +-- src/
|       |
|       +-- app.js
|       +-- server.js
|       |
|       +-- config/
|       |   +-- db.js
|       |
|       +-- controllers/
|       |   +-- authController.js
|       |   +-- cycleController.js
|       |   +-- dailyLogController.js
|       |   +-- emotionController.js
|       |   +-- predictionController.js
|       |   +-- symptomController.js
|       |   +-- userController.js
|       |
|       +-- middleware/
|       |   +-- authMiddleware.js
|       |
|       +-- models/
|       |   +-- Cycle.js
|       |   +-- DailyLog.js
|       |   +-- Emotion.js
|       |   +-- Prediction.js
|       |   +-- Recommendation.js
|       |   +-- Symptom.js
|       |   +-- User.js
|       |
|       +-- routes/
|       |   +-- authRoutes.js
|       |   +-- cycleRoutes.js
|       |   +-- dailyLogRoutes.js
|       |   +-- emotionRoutes.js
|       |   +-- predictionRoutes.js
|       |   +-- symptomRoutes.js
|       |   +-- userRoutes.js
|       |
|       +-- services/
|           +-- fastapiService.js
|
+-- ml-service/
    |
    +-- app/
    |   +-- __init__.py
    |   +-- main.py
    |
    +-- data/
    |   +-- PCOS_data_without_infertility.xlsx
    |   +-- PCOS_infertility.csv
    |   +-- pcos_clean.csv
    |
    +-- models/
    |   +-- lunara_pcos_model.joblib
    |   +-- pcos_model.joblib
    |   +-- feature_importance.csv
    |   +-- feature_importance.png
    |
    +-- preprocess.py
    +-- train_model.py
    +-- train_app_model.py
    +-- evaluate_model.py
    +-- tune_model.py
    +-- feature_importance.py
    +-- final_train.py
    +-- requirements.txt
```

---

## 7. Member 1 — Mobile Application

The mobile application is built using React Native and Expo.

### Main Features

#### Authentication

* User registration
* User login
* JWT-based session handling
* Persistent authentication state

#### Health Profile

Users can provide:

* Age
* Height
* Weight
* Average cycle length
* Average period length
* PCOS family history
* Known health conditions
* PCOS-related symptoms

#### Dashboard

The dashboard provides:

* Current cycle information
* PCOS risk status
* Quick actions
* Wellness insights
* Recommendations
* Progress information

#### Cycle Tracking

Users can:

* View menstrual cycles
* Log period dates
* View cycle history
* Track cycle length

#### Symptom Tracking

Users can record and monitor symptoms through categorized symptom selections.

#### Daily Check-In

Users can track:

* Sleep
* Water intake
* Food and cravings
* Physical activity
* Energy
* Stress
* Physical symptoms

#### Emotion Input

The emotion module supports:

* Text input
* Voice input
* Facial capture
* Manual emotion selection

#### PCOS Risk Result

The application displays:

* PCOS risk score
* Risk level
* Contributing factors
* AI-generated explanations

The result is presented as a screening and wellness indicator rather than a medical diagnosis.

#### Progress Analytics

The application provides historical wellness information such as:

* Sleep trends
* Stress trends
* Energy trends
* Cycle length history
* Emotion trends

---

## 8. Member 2 — AI/ML System

The AI/ML system provides PCOS risk screening through a dedicated FastAPI service.

### Dataset

The PCOS model is trained using the PCOS dataset included in:

```text
ml-service/data/
```

The preprocessing pipeline generates a cleaned dataset used for model development.

### Lunara Model Features

The application-compatible model uses 11 features:

```text
age
heightCm
weightKg
bmi
avgCycleLength
irregularPeriods
weightGain
hairGrowth
skinDarkening
hairLoss
pimples
```

These features are generated from the user's health profile and symptom information.

### Machine Learning Model

The Lunara-compatible screening model uses:

```text
XGBoost Classifier
```

with preprocessing through:

```text
SimpleImputer
```

The trained model is stored as:

```text
ml-service/models/lunara_pcos_model.joblib
```

### Model Configuration

The model uses parameters including:

```text
n_estimators = 300
max_depth = 4
learning_rate = 0.05
subsample = 0.8
colsample_bytree = 0.8
objective = binary:logistic
```

### Model Training

The training script is:

```text
ml-service/train_app_model.py
```

It:

1. Loads the cleaned PCOS dataset.
2. Selects features available to the Lunara application.
3. Splits the dataset into training and testing sets.
4. Trains the XGBoost classifier.
5. Evaluates the model.
6. Retrains the final model using the complete dataset.
7. Saves the trained model as `lunara_pcos_model.joblib`.

### Model Evaluation

The model training pipeline evaluates:

* Accuracy
* Precision
* Recall
* F1 Score
* ROC-AUC
* Classification Report
* Confusion Matrix

---

## 9. PCOS Risk Prediction

The FastAPI service receives health profile information from the backend.

Example request structure:

```json
{
  "age": 24,
  "heightCm": 160,
  "weightKg": 65,
  "avgCycleLength": 38,
  "avgPeriodLength": 5,
  "pcosFamilyHistory": true,
  "knownConditions": [],
  "symptomsChecklist": [
    "Irregular periods",
    "Acne",
    "Excess hair growth"
  ]
}
```

The service converts the request into the 11 model features.

BMI is calculated using:

```text
BMI = weight / height²
```

where height is converted from centimeters to meters.

---

## 10. Risk Level Classification

The model generates a probability of PCOS.

The probability is converted into a percentage risk score.

The current wellness risk categories are:

```text
Probability < 0.35
        |
        v
      Low

0.35 <= Probability < 0.65
        |
        v
    Moderate

Probability >= 0.65
        |
        v
      High
```

The API returns:

```json
{
  "riskLevel": "Moderate",
  "riskScore": 52.34,
  "shap": []
}
```

---

## 11. SHAP-Based Explainability

SHAP is included in the ML environment for model explainability.

The project uses SHAP-related feature explanations to help communicate which input factors are relevant to the model's prediction.

The FastAPI response provides contributing features using the following structure:

```json
{
  "feature": "hairGrowth",
  "contribution": 18.52,
  "direction": "positive"
}
```

The explanation information is intended to improve transparency and user understanding.

These explanations should not be interpreted as medical conclusions.

---

## 12. FastAPI ML Service

The ML service is implemented using FastAPI.

Main file:

```text
ml-service/app/main.py
```

The service loads:

```text
ml-service/models/lunara_pcos_model.joblib
```

when the application starts.

### Start the ML Service

From the `ml-service` directory:

```bash
uvicorn app.main:app --reload --port 8000
```

If port `8000` is already being used by a running FastAPI service, the existing service can be checked instead of starting another instance.

---

## 13. FastAPI Health Check

The service provides:

```text
GET /health
```

Example:

```bash
Invoke-RestMethod http://127.0.0.1:8000/health
```

Expected response:

```text
status service
------ -------
ok     Lunara PCOS Risk API
```

The root endpoint is also available:

```text
GET /
```

Example response:

```json
{
  "service": "Lunara PCOS Risk API",
  "status": "running",
  "model": "lunara_pcos_model.joblib",
  "model_loaded": true
}
```

---

## 14. API Integration

The React Native application communicates with the Node.js backend through Axios.

Main client:

```text
src/api/client.js
```

The mobile application uses:

```text
http://localhost:5000/api
```

for local backend communication.

When testing on a physical device, `localhost` should be replaced with the development machine's LAN IP address.

The overall communication architecture is:

```text
React Native
     |
     | HTTP / REST
     v
Node.js / Express
     |
     | MongoDB operations
     v
MongoDB

Node.js / Express
     |
     | HTTP
     v
FastAPI
     |
     v
XGBoost Model
```

---

## 15. Backend-to-ML Communication

Member 3's backend communicates with the FastAPI ML service through:

```text
backend/src/services/fastapiService.js
```

The prediction controller is:

```text
backend/src/controllers/predictionController.js
```

The backend receives prediction-related information from the mobile application and forwards the required health information to the ML service.

The ML service returns:

* Risk level
* Risk score
* Feature explanations

The backend can then store prediction information in MongoDB and return the result to the mobile application.

---

## 16. Backend and Database

The backend is built with Node.js and Express.

### Backend Structure

```text
backend/src/
|
+-- app.js
+-- server.js
|
+-- config/
|   +-- db.js
|
+-- controllers/
|   +-- authController.js
|   +-- cycleController.js
|   +-- dailyLogController.js
|   +-- emotionController.js
|   +-- predictionController.js
|   +-- symptomController.js
|   +-- userController.js
|
+-- middleware/
|   +-- authMiddleware.js
|
+-- models/
|   +-- Cycle.js
|   +-- DailyLog.js
|   +-- Emotion.js
|   +-- Prediction.js
|   +-- Recommendation.js
|   +-- Symptom.js
|   +-- User.js
|
+-- routes/
|   +-- authRoutes.js
|   +-- cycleRoutes.js
|   +-- dailyLogRoutes.js
|   +-- emotionRoutes.js
|   +-- predictionRoutes.js
|   +-- symptomRoutes.js
|   +-- userRoutes.js
|
+-- services/
    +-- fastapiService.js
```

### MongoDB Models

The backend contains models for:

* Users
* Cycles
* Daily logs
* Emotions
* Predictions
* Recommendations
* Symptoms

---

## 17. Authentication and Authorization

The backend uses JWT-based authentication.

Authentication includes:

* User registration
* Secure password hashing
* User login
* JWT token generation
* Protected API routes
* Authentication middleware

Passwords are hashed using:

```text
bcryptjs
```

JWT tokens are used to authenticate protected requests between the mobile application and backend.

---

## 18. Security

The project follows several security practices:

* Password hashing using bcrypt
* JWT-based authentication
* Protected backend routes
* Environment variables for configuration
* `.env` files excluded from Git
* CORS configuration
* Validation of API input
* No hard-coded passwords
* No hard-coded database credentials
* No sensitive authentication tokens committed to the repository

The `.gitignore` includes:

```text
node_modules/
.expo/
dist/
web-build/
*.log
.DS_Store
.env
```

---

## 19. Installation and Setup

### Prerequisites

Install:

* Node.js 18 or later
* Python 3.10 or compatible Python version
* MongoDB
* Git
* Expo-compatible development environment

### Clone the Repository

```bash
git clone https://github.com/rvitmonisha/LunaraApp.git
cd LunaraApp
```

### Install Mobile Application Dependencies

```bash
npm install
```

### Start the Mobile Application

```bash
npx expo start
```

---

## 20. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure the required environment variables in:

```text
.env
```

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## 21. ML Service Setup

Navigate to:

```bash
cd ml-service
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it in PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install ML dependencies:

```bash
pip install -r requirements.txt
```

The trained Lunara model is already stored at:

```text
ml-service/models/lunara_pcos_model.joblib
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

The ML service will be available at:

```text
http://127.0.0.1:8000
```

---

## 22. Running the Complete System

The recommended development order is:

### Step 1 — Start MongoDB

Make sure MongoDB is running.

### Step 2 — Start the Node.js Backend

```bash
cd backend
npm run dev
```

### Step 3 — Start the FastAPI ML Service

```bash
cd ml-service
uvicorn app.main:app --reload --port 8000
```

### Step 4 — Start the React Native Application

From the project root:

```bash
npm start
```

or:

```bash
npx expo start
```

The complete flow is then:

```text
React Native App
       |
       v
Node.js Backend
       |
       +---------------------> MongoDB
       |
       v
FastAPI ML Service
       |
       v
XGBoost Model
       |
       v
PCOS Risk Result
       |
       v
Node.js Backend
       |
       v
React Native App
```

---

## 23. Project Development Workflow

The project is organized into three major technical layers:

```text
Mobile Layer
     |
     v
React Native / Expo
     |
     v
Backend Layer
     |
     v
Node.js / Express
     |
     +----------------+
     |                |
     v                v
 MongoDB          AI Layer
                  |
                  v
             FastAPI / XGBoost
```

This separation allows each team member to work independently while maintaining defined API communication between the layers.

---

## 24. AI Model Files

Important ML files include:

```text
ml-service/
|
+-- train_model.py
+-- train_app_model.py
+-- evaluate_model.py
+-- tune_model.py
+-- feature_importance.py
+-- final_train.py
+-- preprocess.py
|
+-- models/
    +-- lunara_pcos_model.joblib
    +-- pcos_model.joblib
    +-- feature_importance.csv
    +-- feature_importance.png
```

The main model used by the Lunara FastAPI application is:

```text
lunara_pcos_model.joblib
```

---

## 25. API Endpoints

### ML Service

```text
GET  /
GET  /health
POST /predict
```

### Backend API Categories

```text
/api/auth
/api/users
/api/cycles
/api/symptoms
/api/daily-logs
/api/emotions
/api/predictions
```

The exact request and response structures are maintained in the corresponding API and route files.

---

## 26. Design Approach

Lunara uses a wellness-focused interface designed around menstrual health and long-term tracking.

A moon-phase visual language is used for cycle and progress-related representations.

The mobile interface focuses on:

* Clear health information
* Simple data entry
* Visual progress tracking
* Personalized insights
* Accessible navigation
* User-friendly AI results

---

## 27. Responsible AI and Privacy

Lunara's AI features are designed to support wellness screening and user awareness.

The PCOS model:

* Does not replace professional medical evaluation.
* Does not provide a confirmed medical diagnosis.
* Provides a risk-oriented prediction based on available input features.
* Should be interpreted together with appropriate professional medical guidance.

User health information should be handled securely and should not be exposed through logs, source code, or publicly accessible configuration files.

---

## 28. Disclaimer

Lunara is a women's health and wellness application intended for educational, tracking, and screening purposes.

The PCOS risk score and AI-generated explanations are not medical diagnoses and should not be used as a substitute for consultation with a qualified healthcare professional.

Users with health concerns should seek appropriate professional medical advice.

---

## 29. Future Enhancements

Potential future improvements include:

* More advanced multimodal emotion analysis
* Improved SHAP visualization
* Additional machine learning models
* Larger and more diverse datasets
* Personalized longitudinal risk analysis
* Advanced recommendation algorithms
* Doctor-facing reports
* Cloud deployment
* Production database infrastructure
* Automated model monitoring
* Model versioning
* Enhanced privacy controls
* Comprehensive automated testing

---

## 30. Project Status

Lunara currently integrates:

* React Native / Expo mobile application
* Node.js / Express backend
* MongoDB data layer
* Python / FastAPI ML service
* XGBoost PCOS risk model
* PCOS prediction API
* Risk-level classification
* Feature explanation support
* Authentication and authorization
* Cycle and symptom tracking
* Emotion input
* Wellness analytics
* Backend-to-ML communication

The architecture is designed so additional wellness and post-diagnosis functionality can be integrated without changing the core mobile, backend, or AI service structure.
