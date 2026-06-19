const express = require('express')
const router = express.Router()

const scheduleCon = require('../controllers/schedule.controller')

router.get("/schedule", middleware, scheduleCon.getSchedule)
router.post("/schedule", middleware, scheduleCon.postSchedule)

module.exports = router