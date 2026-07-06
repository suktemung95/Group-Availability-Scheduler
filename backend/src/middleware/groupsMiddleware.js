const runQuery = require("../db/pool")
const { sendError, sendSuccess } = require("../utils/responses")

async function verifyMembership(req, res, next) {
    try {
        const id = Number(req.user.userId)
        const groupId = Number(req.params.groupId)

        if (Number.isNaN(groupId)) {
            return sendError(res, 400, "Invalid group id")
        }

        const query = `
            SELECT group_id
            FROM group_members
            WHERE user_id = $1 AND group_id = $2`
        const values = [id, groupId]

        const result = await runQuery(query, values)

        if (result.length === 0) {
            return sendError(res, 403, "User is not a member of group")
        }
        next()
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

async function verifyOwnership(req, res, next) {
    try {
        const id = Number(req.user.userId)
        const groupId = Number(req.params.groupId)

        if (Number.isNaN(groupId)) {
            return sendError(res, 400, "Invalid group id")
        }

        const query = `
            SELECT role
            FROM group_members
            WHERE user_id = $1 AND group_id = $2`
        const values = [id, groupId]

        const result = await runQuery(query, values)

        const role = result[0].role

        if (role !== 'owner') {
            return sendError(res, 403, "Insufficient permissions")
        }
        next()
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

async function verifySharedGroup(req, res, next) {
    try {
        const id = Number(req.user.userId)
        const id2 = Number(req.params.userId)

        if (Number.isNaN(id2)) {
            return sendError(res, 400, "Invalid user id")
        }

        const query = `
            SELECT *
            FROM group_members gm1
            JOIN group_members gm2
            ON gm1.group_id = gm2.group_id
            WHERE gm1.user_id = $1 AND gm2.user_id = $2
            `
        const values = [id, id2]

        const result = await runQuery(query, values)

        console.log(result)

        if (result.length === 0) {
            return sendError(res, 403, "No shared groups")
        }
        next()
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

module.exports = {
    verifyMembership,
    verifyOwnership,
    verifySharedGroup
}