const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const middleware = require("../middleware/middleware")

router.get("/groups", middleware, userCon.getUserGroups)
router.get("/:userId/overlap", middleware, userCon.getOverlap)

module.exports = router