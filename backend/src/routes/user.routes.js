const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const auth = require("../middleware/auth")

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User retrieved
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Database error
 */
router.get("/me", auth, userCon.getMe)

module.exports = router