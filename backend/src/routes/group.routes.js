const express = require('express')
const router = express.Router()

const groupCon = require('../controllers/group.controller')
const auth = require("../middleware/auth")
const { verifyMembership, verifyOwnership } = require("../middleware/groupsMiddleware")
const { verifySharedGroup } = require("../middleware/groupsMiddleware")

router.post("/", auth, groupCon.postGroup)
router.post("/:groupId/join", auth, groupCon.joinGroup)
router.post("/:groupId/leave", auth, verifyMembership, groupCon.leaveGroup)
router.get("/:groupId/members", auth, verifyMembership, groupCon.getGroupMembers)
router.get("/:groupId/groupOverlap", auth, verifyMembership, groupCon.getGroupOverlap)
/**
 * @openapi
 * /groups/{groupId}/invite/{username}:
 *   post:
 *     tags:
 *       - Groups
 *     summary: Invite a user to a group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the invited user
 *     responses:
 *       201:
 *         description: Invitation created
 *       400:
 *         description: Invalid group, self-invite, or missing input
 *       404:
 *         description: User not found
 *       409:
 *         description: User was already invited
 *       401:
 *         description: Missing or invalid JWT
 */
router.post("/:groupId/invite/:username", auth,
    verifyMembership, verifyOwnership, groupCon.inviteUser)
router.get("/list", auth, groupCon.getUserGroups)
router.get("/mutualMembers", auth, groupCon.getMutualMembers)
router.get("/:userId/overlap", auth, verifySharedGroup, groupCon.getOverlap)

module.exports = router