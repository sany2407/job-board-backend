# Job Board API

A modular, scalable REST API for a job board application built with Node.js, Express, and MongoDB.

## 🏗️ Architecture

The API follows a modular architecture with clear separation of concerns:

```
backend/
├── controllers/          # Business logic
│   ├── jobController.js
│   └── applicationController.js
├── middleware/           # Express middleware
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── models/              # MongoDB schemas
│   ├── Job.js
│   └── User.js
├── routes/              # Route definitions
│   ├── jobs.js
│   └── auth.js
├── services/            # Data processing & transformations
│   └── jobService.js
├── utils/               # Helper functions
│   ├── timeUtils.js
│   └── responseUtils.js
├── validators/          # Input validation schemas
│   └── jobValidators.js
└── server.js           # Main application file
```

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access
- **Job Management**: CRUD operations for job postings
- **Application System**: Complete application workflow with status tracking
- **Search & Filtering**: Advanced job search with multiple filters
- **Pagination**: Efficient data pagination for large datasets
- **Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Centralized error handling with detailed error messages
- **Modular Design**: Clean, maintainable code structure

## 📋 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

### Jobs (Public)

- `GET /api/jobs` - Get all jobs with filtering and pagination
- `GET /api/jobs/:id` - Get specific job details

### Jobs (Protected - Requires Authentication)

- `POST /api/jobs` - Create new job posting
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting
- `GET /api/jobs/user/my-jobs` - Get user's job postings
- `GET /api/jobs/user/my-jobs-with-applications` - Get user's jobs with application stats

### Applications

- `POST /api/jobs/:id/apply` - Apply for a job
- `GET /api/jobs/:id/applications` - Get applications for a job (job poster only)
- `PUT /api/jobs/:id/applications/:applicationId/status` - Update application status

## 🔧 Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-board
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## 📊 Data Models

### Job Schema

```javascript
{
  title: String (required),
  company: String (required),
  location: String (required),
  type: String (enum: ['full-time', 'part-time', 'contract', 'internship']),
  salary: String,
  description: String (required),
  requirements: String,
  contactEmail: String (required),
  postedBy: ObjectId (ref: 'User'),
  applicants: [ApplicantSchema],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Applicant Schema

```javascript
{
  fullName: String (required),
  email: String (required),
  phone: String,
  coverLetter: String,
  resume: String,
  status: String (enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']),
  reviewedAt: Date,
  reviewedBy: ObjectId (ref: 'User'),
  notes: String,
  appliedAt: Date (default: Date.now)
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token in the Authorization header:

```
Authorization: Bearer <token>
```

## 📝 Validation

All endpoints include comprehensive validation:

- **Input Sanitization**: All inputs are trimmed and sanitized
- **Type Validation**: Proper data type checking
- **Length Validation**: Character limits for all fields
- **Email Validation**: Proper email format validation
- **Enum Validation**: Restricted values for specific fields

## 🛠️ Error Handling

The API provides consistent error responses:

```javascript
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🔍 Search & Filtering

The jobs endpoint supports advanced filtering:

```
GET /api/jobs?search=react&location=remote&type=full-time&page=1&limit=10
```

**Query Parameters:**

- `search` - Text search in title, company, and description
- `location` - Filter by location
- `type` - Filter by job type
- `remote` - Filter remote jobs (true/false)
- `page` - Page number for pagination
- `limit` - Items per page (max 100)

## 📄 Pagination

All list endpoints support pagination with metadata:

```javascript
{
  "jobs": [...],
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

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📈 Performance

- **Database Indexing**: Optimized MongoDB indexes for fast queries
- **Lean Queries**: Efficient data retrieval without Mongoose overhead
- **Pagination**: Prevents large dataset loading
- **Caching**: Ready for Redis integration

## 🔧 Development

### Code Style

- ESLint configuration for consistent code style
- JSDoc comments for all functions
- Modular architecture for maintainability

### Adding New Features

1. Create controller in `controllers/`
2. Add validation in `validators/`
3. Define routes in `routes/`
4. Add service functions if needed in `services/`
5. Update documentation

## 📞 Support

For questions or issues, please refer to the project documentation or create an issue in the repository.

## 📄 License

This project is licensed under the MIT License.
