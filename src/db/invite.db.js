const runQuery = require("./pool")

exports.getInvites = async (values) => {
    const query = `
        SELECT * FROM group_invites
        WHERE invitee_id = $1
    `

    return await runQuery(query, values)
}

exports.getInvite = async (values) => {
    const query = `
        SELECT * FROM group_invites
        WHERE id = $1
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