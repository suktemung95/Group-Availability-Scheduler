const runQuery = require("../db/pool")
const utils = require("../utils/utils")
const { sendError, sendSuccess } = require("../utils/responses")
const userPool = require("../db/user.db")

exports.getMe = async (req, res) => {
    try {
        const id = req.user.userId
        const result = await userPool.getMe([id])

        return sendSuccess(res, 200, "Successfully fetched user data", result[0])
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}