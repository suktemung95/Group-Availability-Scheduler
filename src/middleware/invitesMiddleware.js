const runQuery = require("../db/pool")
const groupPool = require("../db/group.db")

async function verifyInvited(req, res, next) {
    try {
        const id = req.user.userId
        const inviteId = req.params.inviteId

        //////
        const query = `
            SELECT * FROM group_invites
            WHERE id = $1 AND invitee_id = $2
        `
        const values = [inviteId, id]

        const invite = await runQuery(query, values)

        //////

        if (invite.length === 0) {
            return res.status(403).json({ error: "User was not invited"})
        }

        const group_id = invite[0].group_id

        const result = await groupPool.joinGroup([group_id, id, 'member'])

        res.status(200).json({
            success: "Succesfully joined group",
            invite: invite,
            member_data: result
        })
    } catch (err) {
        res.status(500).json({ error: "Database error"})
    }
}

module.exports = {
    verifyInvited
}