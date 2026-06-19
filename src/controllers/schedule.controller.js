const runQuery = require("../db/pool")
const userServices = require("../services/user.services")
const userPool = require("../db/user.db")

exports.getSchedule = async (req, res) => {
    
    try {
        const id = req.user.userId

        query = ```SELECT * FROM schedule_blocks
            WHERE user_id = $1
            ORDER BY day_of_week ASC, start_time ASC
            ```
        values = [id]

        const result = await runQuery(query, values)

        if (result.length === 0) {
            return res.status(200).json({
                data: []
            })
        }

        const blocks = result
        return res.status(200).json({
            data: blocks,
            pagination: "TBD"
        })
    } catch (err) {
        return res.status(500).json({ error: "Database error"})
    }
}

exports.postSchedule = async (req, res) => {

    try {
        const validBlockTypes = ["free", "busy", "tentative", "private", "other"];
        const id = req.user.userId
        const { dow, start, end, block_type, label } = req.body

        if (dow < 0 || dow > 6) {
            return res.status(422).json({ error: "Invalid DOW"})
        }
        if (end <= start) {
            return res.status(422).json({ error: "Invalid times" })
        }

        if (!validBlockTypes.includes(block_type)) {
            return res.status(422).json({ error: "Invalid block type" });
        }
        
        const conflictQuery = `SELECT *
        FROM schedule_blocks WHERE user_id = $1 AND day_of_week = $2 AND $3 < end_time AND $4 > start_time`
        const conflictValues = [id, dow, start, end]

        const conflicts = await runQuery(conflictQuery, conflictValues)
 
        if (conflicts.length === 0) {
            const insertQuery = `INSERT INTO schedule_blocks (user_id, day_of_week, start_time, end_time, block_type, label)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`
            const insertValues = [id, dow, start, end, block_type, label]
            const block = await runQuery(insertQuery, insertValues)
            return res.status(201).json({
                success: "Added block to schedule",
                data: block[0]
            })
        }

        return res.status(400).json({ error: "Schedule block overlaps with an existing block"})
    } catch (err) {
        return res.status(500).json({ error: "Database error" })
    }
}