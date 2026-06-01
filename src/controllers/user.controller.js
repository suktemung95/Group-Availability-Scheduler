const runQuery = require("../db/pool")

exports.getSchedule = async (req, res) => {
    
    try {
        const id = req.user.userId

        query = ```SELECT * FROM schedule_blocks
            WHERE user_id = $1
            ORDER BY day_of_week ASC, start_time ASC
            ```
        values = [id]

        const result = await runQuery(query, values)

        if (result.rows.length === 0) {
            return res.status(200).json({
                data: []
            })
        }

        const blocks = result.rows
        return res.status(200).json({
            data: blocks,
            pagination: "TBD"
        })
    } catch (err) {
        return res.status(500).json({ error: "Database error"})
    }
}

exports.getGroups = async (req, res) => {

    try {

        const id = req.user.userId
        query = ```SELECT group_id FROM group_members 
        WHERE user_id = $1 ORDER BY ASC```
        values = [id]

        const result = await runQuery(query, values)

        if (result.rows.length === 0) {
            return res.status(200).json({ data: [] })
        }

        const groups = result.rows
        return res.status(200).json({
            data: groups,
            pagination: "TBD"
        })
    } catch (err) {
        return res.status(500).json({ error: "Database Error"})
    }
}