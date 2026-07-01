const express = require('express')
const router = express.Router()

const groupCon = require('../controllers/group.controller')
const middleware = require("../middleware/middleware")
const {verifyMembership, verifyOwnership} = require("../middleware/groupsMiddleware")

router.post("/", middleware, groupCon.postGroup)
router.post("/:groupId/join", middleware, groupCon.joinGroup)
router.post("/:groupId/leave", middleware, verifyMembership, groupCon.leaveGroup)
router.get("/:groupId/members", middleware, verifyMembership, groupCon.getGroupMembers)
router.get("/:groupId/overlap", middleware, verifyMembership, groupCon.getGroupOverlap)
router.post("/:groupId/invite/:userId", middleware,
    verifyMembership, verifyOwnership, groupCon.inviteUser)

module.exports = router