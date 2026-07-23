const utils = require("../utils/utils")
const { sendSuccess, sendError } = require("../utils/responses")
const userPool = require("../db/user.db")
const schedulePool = require('../db/schedule.db')
const { validateScheduleInput, findScheduleConflicts } = require("../services/schedule.services")

exports.getSchedule = async (req, res) => {
    try {
        const id = req.user.userId
        const result = await schedulePool.getSchedule([id])
        return sendSuccess(res, 200, "Schedule successfully returned", result)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.postSchedule = async (req, res) => {

    console.log("Posting schedule")
    try {
        const id = Number(req.user.userId)
        const { dow, start, end, block_type, label } = req.body

        const validationError = validateScheduleInput({dow, start, end, block_type})

        if (validationError) {
            return sendError(res, 422, validationError)
        }
        
        const conflicts = await findScheduleConflicts({
            userId: id,
            dow,
            start,
            end
        })
 
        if (conflicts.length > 0) {
            return sendError(res, 409, "Schedule block overlaps with an existing")
        }

        const result = await schedulePool.postSchedule([id, dow, start, end, block_type, label])
        return sendSuccess(res, 201, "Added block to schedule", result[0])
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.deleteSchedule = async (req, res) => {
    try {
        const id = Number(req.user.userId)
        const blockId = Number(req.params.blockId)

        if (Number.isNaN(blockId)) {
            return sendError(res, 400, "Invalid block id")
        }

        const result = await schedulePool.deleteSchedule([id, blockId])
        

        if (result.length === 0) {
            return sendError(res, 404, "Schedule block not found")
        }
        
        return sendSuccess(res, 200, "Schedule block deleted", result[0])
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.patchSchedule = async (req, res) => {
    try {
        const id = Number(req.user.userId)
        const blockId = Number(req.params.blockId)
        const { dow, start, end, block_type, label } = req.body

        if (Number.isNaN(blockId)) {
            return sendError(res, 400, "Invalid block id")
        }

        const block = await schedulePool.getBlock([blockId, id])

        if (block.length === 0) {
            return sendError(res, 404, "Schedule block not found")
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
            return sendError(res, 422, validationError)
        }

        const conflicts = await findScheduleConflicts({
            userId: id,
            dow: newDow,
            start: newStart,
            end: newEnd,
            excludeBlockId: blockId
        });

        console.log("Checking conflicts:", {
            userId: id,
            blockId,
            dow: newDow,
            start: newStart,
            end: newEnd,
            conflicts
        })

        if (conflicts.length > 0) {
            return sendError(res, 409, "Schedule block overlaps with an existing block")
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

        return sendSuccess(res, 200, "Schedule block updated", result[0])
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}