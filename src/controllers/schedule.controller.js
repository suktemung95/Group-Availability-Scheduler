const runQuery = require("../db/pool")
const utils = require("../utils")
const userPool = require("../db/user.db")
const { validateScheduleInput, findScheduleConflicts } = require("../services/schedule.services")

exports.getSchedule = async (req, res) => {
    
    try {
        const id = req.user.userId

        query = `SELECT * FROM schedule_blocks
            WHERE user_id = $1
            ORDER BY day_of_week ASC, start_time ASC
            `
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
        const id = Number(req.user.userId)
        const { dow, start, end, block_type, label } = req.body

        const validationError = validateScheduleInput({dow, start, end, block_type})

        if (validationError) {
            return res.status(422).json({ error: validationError })
        }
        
        const conflicts = await findScheduleConflicts({
            userId: id,
            dow,
            start,
            end
        })
 
        if (conflicts.length > 0) {
            return res.status(409).json({ error: "Schedule block overlaps with an existing block"})
        }

        const insertQuery = `
            INSERT INTO schedule_blocks (user_id, day_of_week, start_time, end_time, block_type, label)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `
        const insertValues = [id, dow, start, end, block_type, label]
        const result = await runQuery(insertQuery, insertValues)
        return res.status(201).json({
            success: "Added block to schedule",
            data: result[0]
        })
    } catch (err) {
        return res.status(500).json({
            error: "Database error"
        });
    }
}

exports.deleteSchedule = async (req, res) => {
    try {
        const id = Number(req.user.userId)
        const blockId = Number(req.params.blockId)

        if (Number.isNaN(blockId)) {
            return res.status(400).json({ error: "Invalid block id" });
        }

        const query = `
            DELETE FROM schedule_blocks
            WHERE user_id = $1 AND id = $2
            RETURNING *
            `
        const values = [id, blockId]

        const result = await runQuery(query, values)

        if (result.length === 0) {
            return res.status(404).json({ error: "Schedule block not found" })
        }

        return res.status(200).json({
            success: "Schedule block deleted",
            data: result[0]
        })
    } catch (err) {
        return res.status(500).json({ error: "Database error" })
    }
}

exports.patchSchedule = async (req, res) => {
    try {
        const id = Number(req.user.userId)
        const blockId = Number(req.params.blockId)
        const { dow, start, end, block_type, label } = req.body

        if (Number.isNaN(blockId)) {
            return res.status(400).json({ error: "Invalid block id" });
        }

        const getQuery = `
            SELECT *
            FROM schedule_blocks
            WHERE id = $1 AND user_id = $2
        `;
        const getValues = [blockId, id]
        const getResult = await runQuery(getQuery, getValues);

        if (getResult.length === 0) {
            return res.status(404).json({ error: "Schedule block not found" });
        }

        const existing = getResult[0]

        const newDow = dow ?? existing.day_of_week;
        const newStart = start ?? existing.start_time;
        const newEnd = end ?? existing.end_time;
        const newBlockType = block_type ?? existing.block_type;
        const newLabel = label ?? existing.label;

        const validationError = validateScheduleInput({
            dow: newDow,
            start: newStart,
            end: newEnd,
            block_type: newBlockType
        })

        if (validationError) {
            return res.status(422).json({ error: validationError })
        }

        const conflicts = await findScheduleConflicts({
            userId: id,
            dow: newDow,
            start: newStart,
            end: newEnd,
            excludeBlockId: blockId
        });

        if (conflicts.length > 0) {
            return res.status(409).json({ error: "Schedule block overlaps with an existing block" });
        }

        const updateQuery = `
            UPDATE schedule_blocks
            SET day_of_week = $1,
                start_time = $2,
                end_time = $3,
                block_type = $4,
                label = $5
            WHERE id = $6 AND user_id = $7
            RETURNING *
        `;

        const updateValues = [
            newDow,
            newStart,
            newEnd,
            newBlockType,
            newLabel,
            blockId,
            id
        ];

        const updateResult = await runQuery(updateQuery, updateValues);

        return res.status(200).json({
            success: "Schedule block updated",
            data: updateResult[0]
        });
    } catch (err) {
        return res.status(500).json({
                error: "Database error",
                details: err.message
        });
    }
}