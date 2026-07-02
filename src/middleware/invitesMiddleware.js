const invitePool = require("../db/invite.db")
async function verifyInvited(req, res, next) {
    try {
        const id = req.user.userId
        const inviteId = Number(req.params.inviteId)

        if (Number.isNaN(inviteId)) {
            return res.status(400).json({ error: "Invalid invite id" })
        }

        const invite = await invitePool.getInvite([inviteId, id])
        
        if (invite.length === 0) {
            return res.status(403).json({ error: "User was not invited"})
        }

        req.invite = invite[0]
        next()
    } catch (err) {
        res.status(500).json({
            error: "Database error"
        })
    }
}

module.exports = {
    verifyInvited
}