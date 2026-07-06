const groupPool = require("../db/group.db")
const invitePool = require("../db/invite.db")
const { sendSuccess, sendError } = require("../utils/responses")

exports.getInvites = async (req, res) => {
    try {
        const id = req.user.userId

        const result = await invitePool.getInvites([id])

        return sendSuccess(res, 200, "User invites returned", result)

    } catch (err) {
        return sendError(res, 500, "Database error")
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

        return sendSuccess(res, 200, "Succesfully accepted invite", 
            {
                invite,
                member_data: result
            }
        )
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.declineInvite = async (req, res) => {
    try {
        const id = req.user.userId
        const invite = req.invite

        await invitePool.deleteInvite([invite.id])

        return sendSuccess(res, 200, "Succesfully declined invite", invite)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.revokeInvite = async (req, res) => {
    try {
        const id = req.user.userId
        const invite_id = Number(req.params.inviteId)

        if (Number.isNaN(invite_id)) {
            return sendError(res, 400, "Invalid invite id")
        }

        const result = await invitePool.getInvite([invite_id])
        const invite = result[0]

        if (!invite) {
            return sendError(res, 404, "Invite does not exist")
        }

        if (invite.inviter_id === id) {
            await invitePool.deleteInvite(invite_id)
            return sendSuccess(res, 200, "Invite successfully revoked", invite)
        }
        return sendError(res, 403, "User does not have permission to revoke invite")
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}