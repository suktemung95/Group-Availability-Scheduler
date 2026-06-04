const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const middleware = require("../middleware/middleware")

router.get("/schedule", middleware, userCon.getSchedule)
router.get("/groups", middleware, userCon.getGroups)
router.post("/schedule", middleware, userCon.postSchedule)
router.post("/groups", middleware, userCon.postGroup)
router.post("/groups/:groupId/join", middleware, userCon.joinGroup)

module.exports = router