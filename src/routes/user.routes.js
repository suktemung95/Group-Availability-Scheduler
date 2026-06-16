const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const middleware = require("../middleware/middleware")

router.get("/schedule", middleware, userCon.getSchedule)
router.get("/groups", middleware, userCon.getUserGroups)
router.post("/schedule", middleware, userCon.postSchedule)
router.post("/groups", middleware, userCon.postGroup)
router.post("/groups/:groupId/join", middleware, userCon.joinGroup)
router.get("/:userId/overlap", middleware, userCon.getOverlap)
router.get("/:groupId/", userCon.getGroupMembers)
router.get("/group/:groupId/overlap", userCon.getGroupOverlap)

module.exports = router