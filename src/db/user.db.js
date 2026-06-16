const runQuery = require('./pool')
exports.getTwoUserFreeBlocks = async (user1, user2) => {

    const timeQuery = `SELECT user_id, day_of_week, start_time, end_time, block_type
    FROM schedule_blocks WHERE user_id IN ($1, $2) 
    AND block_type = 'free' ORDER BY day_of_week ASC, start_time ASC`
    const timeValues = [user1, user2]

    const blocks = await runQuery(timeQuery, timeValues)
    return blocks
}

exports.getGroupMembers = async (groupId) => {
    const query = `SELECT user_id FROM group_members
        WHERE group_id = $1 ORDER BY joined_at`
    const values = [groupId]

    const members = await runQuery(query, values)
    return members
}

exports.getGroupFreeBlocks = async (groupId) => {
    const query = `SELECT sb.user_id, sb.day_of_week, sb.start_time, sb.end_time, sb.block_type
        FROM group_members gm
        JOIN schedule_blocks sb ON gm.user_id = sb.user_id
        WHERE gm.group_id = $1
        AND sb.block_type = 'free'
        ORDER BY sb.day_of_week ASC, sb.start_time ASC`
    const values = [groupId]

    const freeBlocks = await runQuery(query, values)
    return freeBlocks
}