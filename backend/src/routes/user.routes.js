const express = require('express')
const router = express.Router()

const userCon = require("../controllers/user.controller")
const auth = require("../middleware/auth")
const { verifySharedGroup } = require("../middleware/groupsMiddleware")

router.get("/me", auth, userCon.getMe)
router.get("/:userId/overlap", auth, verifySharedGroup, userCon.getOverlap)

module.exports = router