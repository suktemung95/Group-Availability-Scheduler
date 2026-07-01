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

module.exports = verifyMembership