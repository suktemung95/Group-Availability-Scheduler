const responses = {
  RegisterResponse201: {
    description: "Account Registered Succesfully!",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Register201"
        }
      }
    }
  },

  LoginResponse200: {
    description: "Login Successful",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Login200"
        }
      }
    }
  },
}

module.exports = responses