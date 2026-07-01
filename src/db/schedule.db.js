const runQuery = require("../db/pool")
exports.getSchedule = async (values) => {
    query = `SELECT * FROM schedule_blocks
            WHERE user_id = $1
            ORDER BY day_of_week ASC, start_time ASC
            `

    const result = await runQuery(query, values)
    return result
}

exports.postSchedule = async (values) => {
    const query = `
            INSERT INTO schedule_blocks (user_id, day_of_week, start_time, end_time, block_type, label)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `
    const result = await runQuery(query, values)
    return result
}

exports.deleteSchedule = async (values) => {
    const query = `
        DELETE FROM schedule_blocks
        WHERE user_id = $1 AND id = $2
        RETURNING *
        `
    const result = await runQuery(query, values)
    return result
}

exports.getBlock = async (values) => {
    const query = `
        SELECT *
        FROM schedule_blocks
        WHERE id = $1 AND user_id = $2
    `;
    const result = await runQuery(query, values);
    return result
}

exports.updateSchedule = async (values) => {
    const query = `
            UPDATE schedule_blocks
            SET day_of_week = $1,
                start_time = $2,
                end_time = $3,
                block_type = $4,
                label = $5
            WHERE id = $6 AND user_id = $7
            RETURNING *
        `;

    const result = await runQuery(query, values);
    return result
}