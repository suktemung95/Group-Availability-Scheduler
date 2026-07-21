const runQuery = require("./pool")

exports.getInvites = async (values) => {
    const query = `
        SELECT
            gi.id,
            gi.created_at,
            gi.inviter_id,
            gi.invitee_id,
            gi.group_id,
            g.name AS group_name,
            g.description AS group_description,
            u.username AS inviter_username
        FROM group_invites gi
        JOIN groups g
        ON g.id = gi.group_id
        JOIN users u
        ON u.id = gi.inviter_id
        WHERE gi.invitee_id = $1
        ORDER BY gi.created_at DESC
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