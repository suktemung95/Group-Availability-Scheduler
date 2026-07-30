const swaggerJsdoc = require("swagger-jsdoc")
const path = require("path")
const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "GroupAvail API",
      version: "1.0.0",
      description:
        "REST API for managing users, schedules, groups, and invitations.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      {
        url: "https://group-availability-scheduler.onrender.com",
        description: "Production server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Invalid input",
            },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Request successful",
            },
            data: {
              nullable: true,
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            username: {
              type: "string",
              example: "alice",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: [
            "username",
            "password",
          ],
           properties: {
            username: {
              type: "string",
              minLength: 1,
              example: "alice",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "password123",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/**/*.js"]
}

const swaggerSpec = swaggerJsdoc(options)

console.log(__dirname)
console.log(
  "Swagger paths:",
  Object.keys(swaggerSpec.paths ?? {})
)
module.exports = swaggerSpec