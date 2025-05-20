import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication & User Management API',
      version: '1.0.0',
      description: `
        API documentation for the Authentication & User Management Microservice.
        
        ## Features
        - User registration and authentication
        - Profile management
        - KYC document handling
        - Wallet management
        - Account management
        - Audit logging
        
        ## Security
        - JWT Authentication
        - Rate Limiting
        - Role-based Access Control
        - Input Validation
        - XSS Protection
        - CORS Enabled
        
        ## Rate Limits
        - Login: 5 attempts per 15 minutes
        - API: 100 requests per 15 minutes
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:5000/api/${process.env.API_VERSION}`,
        description: 'Development server'
      },
      {
        url: `https://api.example.com/api/${process.env.API_VERSION}`,
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            fullNames: { type: 'string' },
            phoneNumber: { type: 'string' },
            preferredLanguage: { type: 'string', enum: ['en', 'es', 'fr'] },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            walletAddress: { type: 'string' },
            kycStatus: { type: 'string', enum: ['pending', 'in_progress', 'verified', 'rejected'] },
            role: { type: 'string', enum: ['user', 'admin'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['error'] },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'KYC',
        description: 'KYC document management endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints'
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 