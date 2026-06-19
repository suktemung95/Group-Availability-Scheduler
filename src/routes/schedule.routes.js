const express = require('express')
const router = express.Router()

const scheduleCon = require('../controllers/schedule.controller')

router.get("/", middleware, scheduleCon.getSchedule)
router.post("/", middleware, scheduleCon.postSchedule)

module.exports = router