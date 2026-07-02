const runQuery = require("./pool")

exports.getInvite = async (values) => {
    const query = `
        SELECT * FROM group_invites
        WHERE id = $1 AND invitee_id = $2
    `
    const result = await runQuery(query, values)
    return result
}

exports.deleteInvite = async (values) => {
    const query = `
        DELETE FROM group_invites
        WHERE id = $1
        RETURNING *
    `
    const result = await runQuery(query, values)
    return result
}