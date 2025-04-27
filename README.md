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
   ```
   npm install
   ```
3. Set up environment variables by creating a `.env` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/healthtrack
   JWT_SECRET=healthtrack-secret-key-development
   PORT=5000
   NODE_ENV=development
   ```
   
   If you're using MongoDB Atlas, replace the MONGODB_URI with your connection string.

4. Create a test user (Optional but recommended for first-time setup):
   ```
   npm run create-test-user
   ```
   This will create a user with:
   - Username: testuser
   - Password: password123

### Running the Application

Start the server in development mode:
```
npm run dev
```

Or start in production mode:
```
npm start
```

Then open your browser to `http://localhost:5000`

## Troubleshooting

### Login Issues

If you encounter login problems:

1. Make sure MongoDB is running properly
2. Verify your `.env` file is correctly set up
3. Check server console for any error messages
4. Try creating a test user with `npm run create-test-user`
5. Ensure you're using the correct credentials

### MongoDB Connection Issues

If you see "MongoDB connection error" messages:

1. Ensure MongoDB is running locally on port 27017 (default port)
2. If using MongoDB Atlas, verify your connection string and network access settings
3. Check if your IP address is whitelisted in MongoDB Atlas
4. Verify there are no firewall issues blocking the connection

### Port Already in Use

If you see "Port 5000 is already in use" error:

1. Change the PORT in your `.env` file to another value (e.g., 5001, 3000)
2. Find and terminate the process using port 5000
3. Restart the server

## Project Structure

- `server.js`: Main server file with MongoDB backend
- `public/`: Static files and frontend code
  - `index.html`: Main HTML file
  - `css/`: Stylesheets
  - `js/`: JavaScript modules
    - `app.js`: Main frontend application
    - `auth.js`: Authentication module
    - `health-records.js`: Health records management
    - `disease-prediction.js`: Disease prediction functionality
    - `data-service.js`: Data processing and model training
- `create-test-user.js`: Utility script to create a test user

## MongoDB Schema

The application uses two main MongoDB collections:

### Users Collection
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  fullName: String,
  age: String,
  gender: String,
  height: String,
  weight: String,
  medicalHistory: String,
  allergies: String,
  joinDate: Date
}
```

### Health Records Collection
```javascript
{
  userId: ObjectId (reference to User),
  date: String (required),
  recordType: String (enum: 'routine', 'monthly'),
  bloodPressure: String,
  heartRate: String,
  temperature: String,
  weight: String,
  symptoms: String,
  notes: String,
  createdAt: Date
}
```

## API Endpoints

The backend provides the following RESTful API endpoints:

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change user password
- `DELETE /api/users` - Delete user account

### Health Records
- `GET /api/health-records` - Get all health records for current user
- `POST /api/health-records` - Add a new health record
- `PUT /api/health-records/:id` - Update a health record
- `DELETE /api/health-records/:id` - Delete a health record

## How the Disease Prediction Works

The disease prediction system uses a combination of machine learning techniques:

1. **Data Preparation**: The system uses a dataset of disease symptoms with labeled diagnoses
2. **Feature Extraction**: User symptoms are converted to feature vectors
3. **Model Training**: Random Forest, Decision Tree, or Naive Bayes models are trained
4. **Prediction**: The trained model predicts possible diseases based on user symptoms
5. **Confidence Scoring**: Each prediction includes a confidence score
6. **Result Presentation**: Results include the most likely disease, confidence level, and alternative possibilities

## Security Considerations

- Passwords are hashed using bcrypt before storing in the database
- JWT is used for authentication with expiration
- Input validation is performed on all API endpoints
- MongoDB connection uses best practices for security

## Deployment

### Deploying to Heroku with MongoDB Atlas

1. Create a MongoDB Atlas cluster and get your connection string
2. Create a Heroku account and install the Heroku CLI
3. Login to Heroku and create a new app:
   ```bash
   heroku login
   heroku create healthtrack-app
   ```
4. Set up environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_atlas_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```
5. Deploy the application:
   ```bash
   git push heroku main
   ```

## Future Improvements

- Integration with wearable devices for automatic health data collection
- Expanded disease database with more symptoms and conditions
- Advanced analytics for health trends and early warning signs
- Export functionality for sharing data with healthcare providers
- Mobile application version for iOS and Android

## Credits

- ML models powered by TensorFlow.js and ML-Random-Forest
- Charts created with Chart.js
- Icons by FontAwesome
- Disease information from various medical resources

## License

This project is licensed under the MIT License. 