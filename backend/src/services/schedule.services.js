const runQuery = require('../db/pool')

exports.findScheduleConflicts = async ({userId, dow, start, end, excludeBlockId = null}) => {
    let query = `
        SELECT *
        FROM schedule_blocks 
        WHERE user_id = $1 
          AND day_of_week = $2 
          AND $3 < end_time 
          AND $4 > start_time
    `;

    const values = [userId, dow, start, end];

    if (excludeBlockId !== null) {
        query += ` AND id != $5`;
        values.push(excludeBlockId);
    }

    return await runQuery(query, values);
}

exports.validateScheduleInput = ({dow, start, end, block_type}) => {
    const validBlockTypes = ["free", "busy", "tentative", "private", "other"];

    if (dow < 0 || dow > 6) {
        return "Invalid DOW";
    }

    if (end <= start) {
        return "Invalid times";
    }

    if (!validBlockTypes.includes(block_type)) {
        return "Invalid block type";
    }

    return null;
}