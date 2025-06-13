# Job Portal Backend

This is the backend for the university job portal built using the MERN stack.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/job-portal
   JWT_SECRET=your_jwt_secret
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- **Register a new user**
  - **POST** `/api/auth/register`
  - **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "role": "student",
      "name": "John Doe"
    }
    ```

- **Login**
  - **POST** `/api/auth/login`
  - **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

### Jobs

- **Post a new job**
  - **POST** `/api/jobs`
  - **Body**:
    ```json
    {
      "title": "Software Developer",
      "description": "Job description here",
      "company": "company_id_here"
    }
    ```

- **Get all jobs**
  - **GET** `/api/jobs`

### Applications

- **Submit a job application**
  - **POST** `/api/applications`
  - **Body**:
    ```json
    {
      "job": "job_id_here",
      "student": "student_id_here"
    }
    ```

- **Get all applications for a student**
  - **GET** `/api/applications/student/:studentId`

## Testing

You can test these endpoints using tools like Postman or curl. Make sure the server is running before testing. 