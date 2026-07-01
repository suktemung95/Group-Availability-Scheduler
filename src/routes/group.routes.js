const express = require('express')
const router = express.Router()

const groupCon = require('../controllers/group.controller')
const auth = require("../middleware/auth")
const {verifyMembership, verifyOwnership} = require("../middleware/groupsMiddleware")

router.post("/", auth, groupCon.postGroup)
router.post("/:groupId/join", auth, groupCon.joinGroup)
router.post("/:groupId/leave", auth, verifyMembership, groupCon.leaveGroup)
router.get("/:groupId/members", auth, verifyMembership, groupCon.getGroupMembers)
router.get("/:groupId/overlap", auth, verifyMembership, groupCon.getGroupOverlap)
router.post("/:groupId/invite/:userId", auth,
    verifyMembership, verifyOwnership, groupCon.inviteUser)

module.exports = router