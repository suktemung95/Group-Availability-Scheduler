const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const middleware = require("../middleware/middleware")
const { verifySharedGroup } = require("../middleware/groupsMiddleware")

router.get("/groups", middleware, userCon.getUserGroups)
router.get("/:userId/overlap", middleware, verifySharedGroup, userCon.getOverlap)

module.exports = router