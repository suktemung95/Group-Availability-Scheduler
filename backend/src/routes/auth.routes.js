const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

/**
 * @openapi
 * /auth/register:
 *  post:
 *    tags: [Auth]
 *    summary: Register an Account
 *    security: []
 *    requestBody:
 *      $ref: "#/components/requestBodies/UserCredentialsBody"
 *    responses:
 *      201: 
 *        $ref: "#/components/responses/RegisterResponse201"
 */
router.post("/register", authController.register);

/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags: [Auth]
 *    summary: Login to an existing Account
 *    security: []
 *    requestBody: 
 *      $ref: "#/components/requestBodies/UserCredentialsBody"
 *    responses:
 *      200:
 *        $ref: "#/components/responses/LoginResponse200"
 */
router.post("/login", authController.login)

module.exports = router;