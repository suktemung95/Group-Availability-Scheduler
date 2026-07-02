const express = require("express")
const router = express.Router()

const inviteCon = require("../controllers/invite.controller")
const {verifyInvited} = require("../middleware/invitesMiddleware")

router.post("/:inviteId/accept", middleware, verifyInvited, inviteCon.acceptInvite)