const express = require('express')
const router = express.Router()

const groupCon = require('../controllers/group.controller')
const middleware = require("../middleware/middleware")
const groupMembershipMiddleware = require("../middleware/groupMembership")

router.post("/", middleware, groupCon.postGroup)
router.post("/:groupId/join", middleware, groupCon.joinGroup)
router.get("/:groupId/members", middleware, groupMembershipMiddleware, groupCon.getGroupMembers)
router.get("/:groupId/overlap", middleware, groupMembershipMiddleware, groupCon.getGroupOverlap)

module.exports = router