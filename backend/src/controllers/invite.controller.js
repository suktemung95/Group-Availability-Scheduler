const groupPool = require("../db/group.db")
const invitePool = require("../db/invite.db")

exports.getInvites = async (req, res) => {
    try {
        const id = req.user.userId

        const result = await invitePool.getInvites([id])

        return res.status(200).json({
            success: "User invites returned",
            data: result
        })
    } catch (err) {
        res.status(500).json({ error: "Database error" })
    }
}

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
        res.status(500).json({ error: "Database error" })
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

exports.revokeInvite = async (req, res) => {
    try {
        const id = req.user.userId
        const invite_id = Number(req.params.inviteId)

        if (Number.isNaN(invite_id)) {
            return res.status(400).json({ error: "Invalid invite id"})
        }

        const result = await invitePool.getInvite([invite_id])
        const invite = result[0]

        if (!invite) {
            return res.status(404).json({ error: "Invite does not exist"})
        }

        if (invite.inviter_id === id) {
            await invitePool.deleteInvite(invite_id)
            return res.status(200).json({ success: "Invite successfully revoked"})
        }

        return res.status(403).json({ error: "User does not have permission to revoke invite"})
    } catch (err) {
        return res.status(500).json({ error: "Database error"})
    }
}