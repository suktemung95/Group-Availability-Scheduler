const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const middleware = require("../middleware/middleware")

router.get("/schedule", middleware, userCon.getSchedule)
router.get("/groups", middleware, userCon.getGroups)
router.post("/schedule", middleware, userCon.postSchedule)
router.post("/group", middleware, userCon.postGroup)

module.exports = router