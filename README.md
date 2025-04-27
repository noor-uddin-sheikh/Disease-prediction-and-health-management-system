# HealthTrack - Disease Prediction System with MongoDB

HealthTrack is a web-based health management system with machine learning-based disease prediction capabilities. The application allows users to track their health data, store records categorized as routine or monthly checks, and get disease predictions based on their symptoms and historical health data.

## Features

- **User Authentication**
  - Secure user registration and login with JWT
  - Password hashing with bcrypt
  - User profile management
  - Password change and account deletion

- **Dashboard**
  - Overview of latest health metrics (heart rate, weight, temperature, blood pressure)
  - Interactive charts showing health trends
  - Recent check-ups summary

- **Health Records**
  - Add, edit, and delete health records
  - Categorize records as routine checks or monthly checks
  - Filter and search through health history

- **Disease Prediction**
  - ML-based disease prediction using symptom analysis
  - Multiple prediction models (Random Forest, Decision Tree, Naive Bayes)
  - Confidence score and alternative disease possibilities
  - Option to include health records in prediction
  - Model insights with feature importance visualization

- **User Profile**
  - Personal and medical information management
  - Notification preferences
  - Data export functionality

## Technology Stack

- **Frontend**
  - HTML5, CSS3, JavaScript (ES6+)
  - Chart.js for data visualization
  - FontAwesome for icons

- **Backend**
  - Node.js & Express.js server
  - MongoDB database for data persistence
  - JWT for authentication
  - bcrypt for password security

- **Machine Learning**
  - TensorFlow.js for ML capabilities
  - ML-Random-Forest for decision tree models
  - Client-side model training and prediction

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
