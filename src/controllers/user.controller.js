const e = require("express")
const runQuery = require("../db/pool")
const userServices = require("../services/user.services")

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
        const query = `SELECT * FROM group_members 
        WHERE user_id = $1 ORDER BY group_id ASC`
        const values = [id]

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
        return res.status(500).json({
            error: "Database Error"
        })
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

        const conflictResult = await runQuery(conflictQuery, conflictValues)
        const conflicts = conflictResult.rows
 
        if (conflicts.length === 0) {
            const insertQuery = `INSERT INTO schedule_blocks (user_id, day_of_week, start_time, end_time, block_type, label)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`
            const insertValues = [id, dow, start, end, block_type, label]
            const block = await runQuery(insertQuery, insertValues)
            return res.status(201).json({
                success: "Added block to schedule",
                data: block.rows[0]
            })
        }

        return res.status(400).json({ error: "Schedule block overlaps with an existing block"})
    } catch (err) {
        return res.status(500).json({ error: "Database error" })
    }
}

exports.postGroup = async (req, res) => {

    try {
        // make group
        const user_id = req.user.userId
        const { name } = req.body
        const makeQuery = `INSERT INTO groups (name, created_by)
        VALUES ($1, $2) RETURNING *`
        let values = [name, user_id]
        const makeResult = await runQuery(makeQuery, values)
        const group_id = makeResult.rows[0].id
        
        // add self to group
        const addQuery = `INSERT INTO group_members (group_id, user_id)
        VALUES ($1, $2) RETURNING *`
        values = [group_id, user_id]
        const result = await runQuery(addQuery, values)
        return res.status(201).json({
            data: result.rows[0],
            group: makeResult.rows[0]
        })
    } catch (err) {
        return res.status(500).json({
            error: "Database error"
        })
    }
}

exports.joinGroup = async (req, res) => {

    try {
        const user_id = req.user.userId
        const group_id = req.params.groupId

        const values = [group_id, user_id]
        const query = `INSERT INTO group_members (group_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (group_id, user_id) DO NOTHING
            RETURNING *`
        const result = await runQuery(query, values)

        if (result.rows.length === 0) {
            return res.status(409).json({
                error: "User is already a member of this group"
            });
        }
            
        return res.status(201).json({
            success: "Added member to group",
            data: result.rows[0]
        })
    } catch (err) {
        return res.status(500).json({ error: "Database error" })
    }
}

exports.getOverlap = async (req, res) => {
    
    const user1 = Number(req.user.userId)
    const user2 = Number(req.params.userId)

    const freeBlocks = await userServices.getUserOverlap(user1, user2)

    return res.status(200).json({
        freeBlocks: freeBlocks
    })
}