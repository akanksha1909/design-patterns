# Survey Management Service

A Low-Level Design (LLD) implementation of a survey management service using Node.js and Express.

## Features

- **Admin Operations:**
  - Create surveys
  - Add questions to surveys with weighted options (Good/Very Good/Poor)
  - Calculate overall rating for a survey
  - Calculate average rating for a particular question

- **User Operations:**
  - Submit responses to survey questions
  - Concurrent access handling (multiple users can fill the same question safely)

## Architecture

The project follows a layered architecture:

```
src/
├── models/          # Data models (Survey, Question, Response)
├── services/        # Business logic (SurveyService, ResponseService, RatingService)
├── controllers/     # Request handlers
├── routes/          # API route definitions
└── middleware/      # Middleware (LockManager for concurrency)
```

## Installation

```bash
npm install
```

## Running the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Survey Management (Admin)

#### Create Survey
```bash
POST /api/surveys
Content-Type: application/json

{
  "title": "Customer Satisfaction Survey",
  "createdBy": "admin1"
}
```

#### Get All Surveys
```bash
GET /api/surveys
```

#### Get Survey by ID
```bash
GET /api/surveys/:surveyId
```

#### Add Question to Survey
```bash
POST /api/surveys/:surveyId/questions
Content-Type: application/json

{
  "text": "How would you rate our service?",
  "options": [
    { "label": "Poor", "weight": 1 },
    { "label": "Good", "weight": 3 },
    { "label": "Very Good", "weight": 5 }
  ]
}
```

### Response Submission (Users)

#### Submit Response
```bash
POST /api/responses
Content-Type: application/json

{
  "surveyId": "survey-id-here",
  "questionId": "question-id-here",
  "userId": "user1",
  "answer": "Very Good"
}
```

#### Get Responses for a Question
```bash
GET /api/responses/question/:questionId
```

### Rating Calculations (Admin)

#### Get Overall Survey Rating
```bash
GET /api/ratings/survey/:surveyId
```

#### Get Question Rating
```bash
GET /api/ratings/survey/:surveyId/question/:questionId
```

## Example Usage

### 1. Create a Survey
```bash
curl -X POST http://localhost:3000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Customer Satisfaction",
    "createdBy": "admin1"
  }'
```

### 2. Add Questions
```bash
curl -X POST http://localhost:3000/api/surveys/{surveyId}/questions \
  -H "Content-Type: application/json" \
  -d '{
    "text": "How would you rate our service?",
    "options": [
      {"label": "Poor", "weight": 1},
      {"label": "Good", "weight": 3},
      {"label": "Very Good", "weight": 5}
    ]
  }'
```

### 3. Submit Response
```bash
curl -X POST http://localhost:3000/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "surveyId": "survey-id",
    "questionId": "question-id",
    "userId": "user1",
    "answer": "Very Good"
  }'
```

### 4. Get Survey Rating
```bash
curl http://localhost:3000/api/ratings/survey/{surveyId}
```

### 5. Get Question Rating
```bash
curl http://localhost:3000/api/ratings/survey/{surveyId}/question/{questionId}
```

## Concurrency Handling

The service uses a `LockManager` to handle concurrent access when multiple users try to submit responses to the same question. The lock ensures:

- Thread-safe response submissions
- No race conditions
- Sequential processing of concurrent requests for the same question

## Rating Calculation

- **Survey Rating**: Average of all question ratings in the survey
- **Question Rating**: Weighted average based on option weights (e.g., Poor=1, Good=3, Very Good=5)

## Health Check

```bash
GET /health
```

Returns server status.

