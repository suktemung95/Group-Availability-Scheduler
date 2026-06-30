const express = require('express')
const router = express.Router()

const middleware = require("../middleware/middleware")
const scheduleCon = require('../controllers/schedule.controller')

router.get("/", middleware, scheduleCon.getSchedule)
router.post("/", middleware, scheduleCon.postSchedule)
router.delete("/:blockId", middleware, scheduleCon.deleteSchedule)
router.patch("/:blockId", middleware, scheduleCon.patchSchedule)

module.exports = router