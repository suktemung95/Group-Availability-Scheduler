const swaggerRequestBodies = {
  UserCredentialsBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/UserCredentials"
        }
      }
    }
  }
}

module.exports = swaggerRequestBodies