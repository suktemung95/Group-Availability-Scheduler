const express = require("express")
const router = express.Router()

const inviteCon = require("../controllers/invite.controller")
const { verifyInvited } = require("../middleware/invitesMiddleware")
const auth = require("../middleware/auth")

router.get('/', auth, inviteCon.getInvites)
router.post("/:inviteId/accept", auth, verifyInvited, inviteCon.acceptInvite)
router.delete("/:inviteId/decline", auth, verifyInvited, inviteCon.declineInvite)
router.delete("/:inviteId/revoke", auth, inviteCon.revokeInvite)
module.exports = router