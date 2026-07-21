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
router.post("/:groupId/invite/:username", auth,
    verifyMembership, verifyOwnership, groupCon.inviteUser)
router.get("/list", auth, groupCon.getUserGroups)
router.get("/mutualMembers", auth, groupCon.getMutualMembers)
router.get("/:userId/overlap", auth, verifySharedGroup, groupCon.getOverlap)

module.exports = router