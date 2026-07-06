const runQuery = require("../db/pool")
const utils = require("../utils/utils")
const { sendError, sendSuccess } = require("../utils/responses")
const userPool = require("../db/user.db")
const userServices = require('../services/user.services')

exports.getMe = async (req, res) => {
    try {
        const id = req.user.userId
        const result = await userPool.getMe([id])

        return sendSuccess(res, 200, "Successfully fetched user data", result[0])
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.getOverlap = async (req, res) => {
    try {
        const user1 = Number(req.user.userId);
        const user2 = Number(req.params.userId);

        if (Number.isNaN(user2)) {
            return sendError(res, 400, "Invalid user id")
        }

        const freeBlocks = await userPool.getTwoUserFreeBlocks(user1, user2);

        const overlap = userServices.findGroupOverlap(freeBlocks, [user1, user2]);

        return sendSuccess(res, 200, "Successfully returned overlap", overlap)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
};