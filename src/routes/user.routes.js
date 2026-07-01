const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const auth = require("../middleware/auth")
const { verifySharedGroup } = require("../middleware/groupsMiddleware")

router.get("/groups", auth, userCon.getUserGroups)
router.get("/:userId/overlap", auth, verifySharedGroup, userCon.getOverlap)

module.exports = router