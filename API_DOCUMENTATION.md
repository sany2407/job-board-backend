# Job Board API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/signup

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login

Login with existing credentials.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Jobs

#### GET /jobs

Get all jobs with optional filtering and pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in title, company, and description
- `location` (optional): Filter by location
- `type` (optional): Filter by job type (full-time, part-time, contract, internship)
- `remote` (optional): Filter remote jobs (true/false)

**Example Request:**

```
GET /jobs?page=1&limit=10&search=developer&location=remote&type=full-time
```

**Response:**

```json
{
  "jobs": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Senior React Developer",
      "company": "Tech Corp",
      "location": "Remote",
      "type": "full-time",
      "salary": "$120,000 - $150,000",
      "description": "We are looking for a talented React developer...",
      "requirements": "React, TypeScript, Node.js",
      "contactEmail": "hr@techcorp.com",
      "postedBy": "507f1f77bcf86cd799439012",
      "postedAt": "2024-01-01T00:00:00.000Z",
      "experience": "3+ years",
      "posted": "Today",
      "skills": ["React", "TypeScript", "Node.js"],
      "logo": "TC",
      "featured": true,
      "remote": true,
      "applicantCount": 5
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalJobs": 50,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 10
  }
}
```

#### GET /jobs/:id

Get a specific job by ID.

**Example Request:**

```
GET /jobs/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "job": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "full-time",
    "salary": "$120,000 - $150,000",
    "description": "We are looking for a talented React developer...",
    "requirements": "React, TypeScript, Node.js",
    "contactEmail": "hr@techcorp.com",
    "postedBy": "507f1f77bcf86cd799439012",
    "postedAt": "2024-01-01T00:00:00.000Z",
    "experience": "3+ years",
    "posted": "Today",
    "skills": ["React", "TypeScript", "Node.js"],
    "logo": "TC",
    "featured": true,
    "remote": true,
    "applicantCount": 5
  }
}
```

#### POST /jobs

Create a new job posting (requires authentication).

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "location": "Remote",
  "type": "full-time",
  "salary": "$120,000 - $150,000",
  "description": "We are looking for a talented React developer to join our team...",
  "requirements": "React, TypeScript, Node.js, 3+ years experience",
  "contactEmail": "hr@techcorp.com"
}
```

**Response:**

```json
{
  "message": "Job posted successfully",
  "job": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "full-time",
    "salary": "$120,000 - $150,000",
    "description": "We are looking for a talented React developer to join our team...",
    "requirements": "React, TypeScript, Node.js, 3+ years experience",
    "contactEmail": "hr@techcorp.com",
    "postedBy": "507f1f77bcf86cd799439012",
    "postedAt": "2024-01-01T00:00:00.000Z",
    "experience": "3+ years",
    "posted": "Today",
    "skills": ["React", "TypeScript", "Node.js", "3+ years experience"],
    "logo": "TC",
    "featured": true,
    "remote": true,
    "applicantCount": 0
  }
}
```

#### PUT /jobs/:id

Update a job posting (requires authentication, job poster only).

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Senior React Developer - Updated",
  "salary": "$130,000 - $160,000",
  "description": "Updated job description..."
}
```

**Response:**

```json
{
  "message": "Job updated successfully",
  "job": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer - Updated",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "full-time",
    "salary": "$130,000 - $160,000",
    "description": "Updated job description...",
    "requirements": "React, TypeScript, Node.js, 3+ years experience",
    "contactEmail": "hr@techcorp.com",
    "postedBy": "507f1f77bcf86cd799439012",
    "postedAt": "2024-01-01T00:00:00.000Z",
    "experience": "3+ years",
    "posted": "Today",
    "skills": ["React", "TypeScript", "Node.js", "3+ years experience"],
    "logo": "TC",
    "featured": true,
    "remote": true,
    "applicantCount": 0
  }
}
```

#### DELETE /jobs/:id

Delete a job posting (requires authentication, job poster only).

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "message": "Job deleted successfully"
}
```

#### GET /jobs/user/my-jobs

Get jobs posted by the authenticated user.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "jobs": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Senior React Developer",
      "company": "Tech Corp",
      "location": "Remote",
      "type": "full-time",
      "salary": "$120,000 - $150,000",
      "description": "We are looking for a talented React developer...",
      "requirements": "React, TypeScript, Node.js",
      "contactEmail": "hr@techcorp.com",
      "postedBy": "507f1f77bcf86cd799439012",
      "postedAt": "2024-01-01T00:00:00.000Z",
      "experience": "3+ years",
      "posted": "Today",
      "skills": ["React", "TypeScript", "Node.js"],
      "logo": "TC",
      "featured": true,
      "remote": true,
      "applicantCount": 5
    }
  ]
}
```

#### GET /jobs/user/my-jobs-with-applications

Get user's jobs with application statistics.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "jobs": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Senior React Developer",
      "company": "Tech Corp",
      "location": "Remote",
      "type": "full-time",
      "salary": "$120,000 - $150,000",
      "description": "We are looking for a talented React developer...",
      "requirements": "React, TypeScript, Node.js",
      "contactEmail": "hr@techcorp.com",
      "postedBy": "507f1f77bcf86cd799439012",
      "postedAt": "2024-01-01T00:00:00.000Z",
      "experience": "3+ years",
      "posted": "Today",
      "skills": ["React", "TypeScript", "Node.js"],
      "logo": "TC",
      "featured": true,
      "remote": true,
      "applicantCount": 5,
      "totalApplications": 5,
      "pendingApplications": 3,
      "shortlistedApplications": 1,
      "rejectedApplications": 1,
      "hiredApplications": 0
    }
  ]
}
```

### Applications

#### POST /jobs/:id/apply

Apply for a job.

**Request Body:**

```json
{
  "fullName": "John Smith",
  "email": "john.smith@email.com",
  "phone": "+1-555-0123",
  "coverLetter": "I'm excited to apply for this position...",
  "resume": "john-smith-resume.pdf"
}
```

**Response:**

```json
{
  "message": "Application submitted successfully",
  "application": {
    "fullName": "John Smith",
    "email": "john.smith@email.com",
    "phone": "+1-555-0123",
    "coverLetter": "I'm excited to apply for this position...",
    "resume": "john-smith-resume.pdf",
    "appliedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /jobs/:id/applications

Get all applications for a job (requires authentication, job poster only).

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "job": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "full-time"
  },
  "applications": [
    {
      "id": "507f1f77bcf86cd799439013",
      "fullName": "John Smith",
      "email": "john.smith@email.com",
      "phone": "+1-555-0123",
      "coverLetter": "I'm excited to apply for this position...",
      "resume": "john-smith-resume.pdf",
      "appliedAt": "2024-01-01T00:00:00.000Z",
      "status": "pending",
      "reviewedAt": null,
      "notes": null,
      "timeAgo": "Today"
    }
  ],
  "stats": {
    "total": 5,
    "pending": 3,
    "shortlisted": 1,
    "rejected": 1,
    "hired": 0
  }
}
```

#### PUT /jobs/:id/applications/:applicationId/status

Update application status (requires authentication, job poster only).

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "shortlisted",
  "notes": "Great candidate, strong technical skills"
}
```

**Response:**

```json
{
  "message": "Application status updated successfully",
  "application": {
    "id": "507f1f77bcf86cd799439013",
    "fullName": "John Smith",
    "email": "john.smith@email.com",
    "phone": "+1-555-0123",
    "coverLetter": "I'm excited to apply for this position...",
    "resume": "john-smith-resume.pdf",
    "appliedAt": "2024-01-01T00:00:00.000Z",
    "status": "shortlisted",
    "reviewedAt": "2024-01-02T00:00:00.000Z",
    "notes": "Great candidate, strong technical skills",
    "timeAgo": "Today"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Error Example

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Job title must be between 5 and 100 characters",
    "Please provide a valid contact email"
  ]
}
```

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

## CORS

The API supports CORS for cross-origin requests. All origins are allowed in development.

## Health Check

#### GET /health

Check if the API is running.

**Response:**

```json
{
  "status": "OK",
  "message": "Job Board API is running"
}
```
