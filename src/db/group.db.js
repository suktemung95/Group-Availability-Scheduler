const runQuery = require('./pool')
exports.makeGroup = async (values) => {
    const query = `INSERT INTO groups (name, created_by)
        VALUES ($1, $2) RETURNING *`
    const result = await runQuery(query, values)
    return result
}

exports.joinGroup = async (values) => {
    const q = `
        INSERT INTO group_members (group_id, user_id, role)
        VALUES ($1, $2, $3) RETURNING *`
    const result = await runQuery(q, v)
    return result
}

exports.leaveGroup = async (values) => {
     const query = `
            DELETE FROM group_members
            WHERE user_id = $1 AND group_id = $2
            RETURNING *
        `
    const result = await runQuery(query, values)
    return result
}

exports.getGroupMembers = async (values) => {
    const query = `SELECT user_id FROM group_members
        WHERE group_id = $1 ORDER BY joined_at`
    const members = await runQuery(query, values)
    return members
}

exports.getGroupFreeBlocks = async (values) => {
    const query = `SELECT sb.user_id, sb.day_of_week, sb.start_time, sb.end_time, sb.block_type
        FROM group_members gm
        JOIN schedule_blocks sb ON gm.user_id = sb.user_id
        WHERE gm.group_id = $1
        AND sb.block_type = 'free'
        ORDER BY sb.day_of_week ASC, sb.start_time ASC`

    const freeBlocks = await runQuery(query, values)
    return freeBlocks
}

exports.makeInvite = async (values) => {
    const query = `
            INSERT INTO group_invites (inviter_id, invitee_id, group_id)
            VALUES ($1, $2, $3)
            RETURNING *`

    const result = await runQuery(query, values)
    return result
}