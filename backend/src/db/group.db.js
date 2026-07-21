const runQuery = require('./pool')
exports.makeGroup = async (values) => {
    const query = `INSERT INTO groups (name, created_by, description)
        VALUES ($1, $2, $3) RETURNING *`
    const result = await runQuery(query, values)
    return result
}

exports.joinGroup = async (values) => {
    const query = `
        INSERT INTO group_members (group_id, user_id, role)
        VALUES ($1, $2, $3) RETURNING *`
    const result = await runQuery(query, values)
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
    const query = `
    SELECT
        gm.user_id,
        gm.role,
        gm.joined_at,
        u.username,
        u.timezone
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = $1
    ORDER BY gm.joined_at;`

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

exports.getUserGroups = async (values) => {
  const query = `
    SELECT
      gm.group_id,
      gm.user_id,
      gm.joined_at,
      gm.role,
      g.name,
      g.description,
      g.created_by,
      g.created_at
    FROM group_members gm
    JOIN groups g ON g.id = gm.group_id
    WHERE gm.user_id = $1
    ORDER BY gm.group_id ASC
  `

  return await runQuery(query, values)
}

exports.getMutualMembers = async (values) => {
    const query = `
        SELECT DISTINCT
            g2.user_id,
            u.username
        FROM group_members AS g
        JOIN group_members AS g2
            ON g2.group_id = g.group_id
        JOIN users AS u
            ON u.id = g2.user_id
        WHERE g.user_id = $1
        AND g2.user_id <> $1
        ORDER BY u.username;`
    
    return await runQuery(query, values)
}