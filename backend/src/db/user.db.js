const runQuery = require('./pool')
exports.getTwoUserFreeBlocks = async (user1, user2) => {

    const timeQuery = `SELECT user_id, day_of_week, start_time, end_time, block_type
    FROM schedule_blocks WHERE user_id IN ($1, $2) 
    AND block_type = 'free' ORDER BY day_of_week ASC, start_time ASC`
    const timeValues = [user1, user2]

    const blocks = await runQuery(timeQuery, timeValues)
    return blocks
}

exports.getUserGroups = async (userId) => {
    const query = `SELECT * FROM group_members 
        WHERE user_id = $1 ORDER BY group_id ASC`
    const values = [id]

    const result = await runQuery(query, values)
    return result
}