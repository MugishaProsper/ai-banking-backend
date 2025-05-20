# Authentication & User Management Microservice API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullNames": "John Doe",
  "phoneNumber": "+1234567890",
  "preferredLanguage": "en",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullNames": "John Doe",
      "walletAddress": "0x...",
      "kycStatus": "pending",
      "isActive": true,
      "createdAt": "2024-03-20T10:00:00Z"
    },
    "token": "jwt_token"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullNames": "John Doe",
      "walletAddress": "0x...",
      "kycStatus": "pending",
      "isActive": true
    },
    "token": "jwt_token"
  }
}
```

### Verify Email
```http
GET /auth/verify-email/:token
```

**Response:**
```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

### Request Password Reset
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password reset link sent to email"
}
```

### Reset Password
```http
POST /auth/reset-password/:token
```

**Request Body:**
```json
{
  "password": "newSecurePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password reset successful"
}
```

### Update Password
```http
PATCH /auth/update-password
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

## User Management Endpoints

### Get Profile
```http
GET /users/profile
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullNames": "John Doe",
      "phoneNumber": "+1234567890",
      "preferredLanguage": "en",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "walletAddress": "0x...",
      "kycStatus": "pending",
      "isActive": true,
      "createdAt": "2024-03-20T10:00:00Z"
    }
  }
}
```

### Update Profile
```http
PATCH /users/profile
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "fullNames": "John Updated Doe",
  "phoneNumber": "+1987654321",
  "preferredLanguage": "es",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullNames": "John Updated Doe",
      "phoneNumber": "+1987654321",
      "preferredLanguage": "es",
      "address": {
        "street": "456 New St",
        "city": "Los Angeles",
        "state": "CA",
        "zipCode": "90001",
        "country": "USA"
      }
    }
  }
}
```

### Get Wallet Address
```http
GET /users/wallet
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "walletAddress": "0x..."
  }
}
```

### Upload KYC Document
```http
POST /users/kyc/upload
```

**Headers:**
```
Authorization: Bearer jwt_token
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [document file]
documentType: "passport"
documentNumber: "P123456789"
```

**Response:**
```json
{
  "status": "success",
  "message": "Document uploaded successfully",
  "data": {
    "kycStatus": "in_progress"
  }
}
```

### Get KYC Status
```http
GET /users/kyc/status
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "kycStatus": "in_progress",
    "documents": [
      {
        "type": "passport",
        "documentNumber": "P123456789",
        "documentUrl": "https://cloudinary.com/...",
        "uploadedAt": "2024-03-20T10:00:00Z"
      }
    ]
  }
}
```

### Deactivate Account
```http
POST /users/deactivate
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "message": "Account deactivated successfully"
}
```

### Reactivate Account
```http
POST /users/reactivate
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "message": "Account reactivated successfully"
}
```

### Get Audit Logs
```http
GET /users/audit-logs
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "auditLogs": [
      {
        "action": "PROFILE_UPDATED",
        "timestamp": "2024-03-20T10:00:00Z",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "details": {
          "updatedFields": ["fullNames", "phoneNumber"]
        }
      }
    ]
  }
}
```

## Admin Endpoints

### Get All Users
```http
GET /users
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "fullNames": "John Doe",
        "role": "user",
        "isActive": true,
        "createdAt": "2024-03-20T10:00:00Z"
      }
    ]
  }
}
```

### Get User by ID
```http
GET /users/:id
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullNames": "John Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-03-20T10:00:00Z"
    }
  }
}
```

### Delete User
```http
DELETE /users/:id
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Please log in to access this resource"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "status": "error",
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Rate Limiting

- Login attempts are limited to 5 requests per 15 minutes
- All other endpoints are limited to 100 requests per 15 minutes

## Security

- All endpoints except registration and login require JWT authentication
- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- All sensitive data is encrypted
- CORS is enabled for specified origins
- Rate limiting is implemented for all endpoints
- Input validation is performed on all requests
- Audit logging is maintained for all user actions 