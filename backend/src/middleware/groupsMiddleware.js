const runQuery = require("../db/pool")

async function verifyMembership(req, res, next) {
    try {
        const id = Number(req.user.userId)
        const groupId = Number(req.params.groupId)

        if (Number.isNaN(groupId)) {
            return res.status(400).json({ error: "Invalid group id" });
        }

        const query = `
            SELECT group_id
            FROM group_members
            WHERE user_id = $1 AND group_id = $2`
        const values = [id, groupId]

        const result = await runQuery(query, values)

        if (result.length === 0) {
            return res.status(403).json({ error: "User is not a member of group" });
        }
        next()
    } catch (err) {
        return res.status(500).json({ error: "Database Error"})
    }
}

async function verifyOwnership(req, res, next) {
    try {
        const id = Number(req.user.userId)
        const groupId = Number(req.params.groupId)

        if (Number.isNaN(groupId)) {
            return res.status(400).json({ error: "Invalid group id" });
        }

        const query = `
            SELECT role
            FROM group_members
            WHERE user_id = $1 AND group_id = $2`
        const values = [id, groupId]

        const result = await runQuery(query, values)

        const role = result[0].role

        if (role !== 'owner') {
            return res.status(403).json({
                error: "Insufficient permissions",
                role: role
            })
        }
        next()
    } catch (err) {
        return res.status(500).json({ error: "Database Error"})
    }
}

async function verifySharedGroup(req, res, next) {
    try {
        const id = Number(req.user.userId)
        const id2 = Number(req.params.userId)

        if (Number.isNaN(id2)) {
            return res.status(400).json({ error: "Invalid user id" });
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
            return res.status(403).json({
                error: "No shared groups",
            })
        }
        next()
    } catch (err) {
        return res.status(500).json({
            error: "Database Error",
            details: err
        })
    }
}

module.exports = {
    verifyMembership,
    verifyOwnership,
    verifySharedGroup
}