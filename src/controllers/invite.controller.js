const groupPool = require("../db/group.db")
const invitePool = require("../db/invite.db")
exports.acceptInvite = async (req, res) => {
    try {
        const id = req.user.userId
        const invite = req.invite

        const result = await groupPool.joinGroup([
            invite.group_id,
            id,
            'member'
        ])

        await invitePool.deleteInvite([invite.id])

        return res.status(200).json({
            success: "Succesfully accepted invite",
            invite: invite,
            member_data: result
        })
    } catch (err) {
        res.status(500).json({
            error: "Database error",
            details: err.message
        })
    }
}

exports.declineInvite = async (req, res) => {
    try {
        const id = req.user.userId
        const invite = req.invite

        await invitePool.deleteInvite([invite.id])

        return res.status(200).json({
            success: "Succesfully declined invite",
            invite
        })
    } catch (err) {
        res.status(500).json({ error: "Database error"})
    }
}