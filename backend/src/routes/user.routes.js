const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const auth = require("../middleware/auth")

router.get("/me", auth, userCon.getMe)

module.exports = router