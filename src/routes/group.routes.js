const express = require('express')
const router = express.Router()

const groupCon = require('../controllers/group.controller')

router.post("/groups", middleware, groupCon.postGroup)
router.post("/groups/:groupId/join", middleware, groupCon.joinGroup)
router.get("/:groupId/", groupCon.getGroupMembers)
router.get("/group/:groupId/overlap", groupCon.getGroupOverlap)

module.exports = router