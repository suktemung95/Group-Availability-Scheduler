const utils = require("../utils")
const userPool = require("../db/user.db")
const schedulePool = require('../db/schedule.db')
const { validateScheduleInput, findScheduleConflicts } = require("../services/schedule.services")

exports.getSchedule = async (req, res) => {
    
    try {
        const id = req.user.userId

        const result = await schedulePool.getSchedule([id])

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

        const result = await schedulePool.postSchedule([id, dow, start, end, block_type, label])
        
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

        const result = await schedulePool.deleteSchedule([id, blockId])
        

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

        const block = await schedulePool.getBlock([blockId, id])

        if (block.length === 0) {
            return res.status(404).json({ error: "Schedule block not found" });
        }

        const existing = block[0]

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

        const result = await schedulePool.updateSchedule([
            newDow,
            newStart,
            newEnd,
            newBlockType,
            newLabel,
            blockId,
            id
        ])

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