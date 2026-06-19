const express = require('express')
const router = express.Router()

const groupCon = require('../controllers/group.controller')

router.post("/", middleware, groupCon.postGroup)
router.post("/:groupId/join", middleware, groupCon.joinGroup)
router.get("/:groupId/", groupCon.getGroupMembers)
router.get("/:groupId/overlap", groupCon.getGroupOverlap)

module.exports = router