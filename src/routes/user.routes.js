const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")

router.get("/schedule", userCon.getSchedule)
router.get("/groups", userCon.getGroups)