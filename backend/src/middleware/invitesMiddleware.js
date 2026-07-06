const invitePool = require("../db/invite.db")
const { sendError, sendSuccess } = require("../utils/responses")

async function verifyInvited(req, res, next) {
    try {
        const id = req.user.userId
        const inviteId = Number(req.params.inviteId)

        if (Number.isNaN(inviteId)) {
            return sendError(res, 400, "Invalid invite id")
        }

        const invite = await invitePool.getInvite([inviteId])
        
        if (invite[0].invitee_id !== id) {
            return sendError(res, 403, "User was not invited")
        }

        req.invite = invite[0]
        next()
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

module.exports = {
    verifyInvited
}