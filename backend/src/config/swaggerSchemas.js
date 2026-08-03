const swaggerSchemas = {
  User: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1
      },
      username: {
        type: "string",
        example: "Licky"
      }
    }
  },

  UserCredentials: {
    type: "object",
    required: "[username, password]",
    properties: {
      username: {
        type: "string",
        example: "Licky",
      },
      password: {
        type: "string",
        example: "password"
      }
    },
  },

  Register201: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Account registered successfully!",
      },
      data: {
        $ref: "#/components/schemas/User",
      },
    },
  },

  Login200: {
    type: "object",
    properties: {
      "success": {
        type: "boolean",
        example: "true"
      },
      "message": {
        type: "string",
        example: "Login successful"
      },
      "data": {
        type: "string",
        example: "token here"
      }
    }
  }
}

module.exports = swaggerSchemas