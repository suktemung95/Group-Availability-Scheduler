const swaggerJsdoc = require("swagger-jsdoc")
const path = require("path")
const swaggerSchemas = require("./swaggerSchemas")
const swaggerResponses = require("./swaggerResponses")
const swaggerRequestBodies = require("./swaggerRequestBodies")

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

    security: [
      {
        bearerAuth: [],
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

      schemas: swaggerSchemas,
	  responses: swaggerResponses,
	  requestBodies: swaggerRequestBodies
    },
  },

  apis: ["./src/routes/**/*.js"]
}

const swaggerSpec = swaggerJsdoc(options)
module.exports = swaggerSpec