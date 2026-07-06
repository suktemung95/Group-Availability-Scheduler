const runQuery = require("../db/pool")
const utils = require("../utils")
const userPool = require("../db/user.db")
const userServices = require('../services/user.services')

exports.getMe = async (req, res) => {
    try {
        const id = req.user.userId
        const result = await userPool.getMe([id])

        return res.status(200).json({
            Success: "Successfully fetched user data",
            data: result[0]
        })
    } catch (err) {
        return res.status(500).json({
            error: "Database Error"
        })
    }
}

exports.getOverlap = async (req, res) => {
    try {
        const user1 = Number(req.user.userId);
        const user2 = Number(req.params.userId);

        if (Number.isNaN(user2)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        const freeBlocks = await userPool.getTwoUserFreeBlocks(user1, user2);

        const overlap = userServices.findGroupOverlap(freeBlocks, [user1, user2]);

        return res.status(200).json({
            free_time: overlap
        });
    } catch (err) {
        return res.status(500).json({
            error: "Database Error"
        });
    }
};