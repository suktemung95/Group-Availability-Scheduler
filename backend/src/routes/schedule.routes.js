const express = require('express')
const router = express.Router()

const auth = require("../middleware/auth")
const scheduleCon = require('../controllers/schedule.controller')

router.get("/", auth, scheduleCon.getSchedule)
router.post("/", auth, scheduleCon.postSchedule)
router.delete("/:blockId", auth, scheduleCon.deleteSchedule)
router.patch("/:blockId", auth, scheduleCon.patchSchedule)

module.exports = router