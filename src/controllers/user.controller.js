const runQuery = require("../db/pool")
const utils = require("../utils")
const userPool = require("../db/user.db")
const userServices = require('../services/user.services')

exports.getUserGroups = async (req, res) => {

    try {

        const id = req.user.userId
        const query = `SELECT * FROM group_members 
        WHERE user_id = $1 ORDER BY group_id ASC`
        const values = [id]

        const result = await runQuery(query, values)

        if (result.length === 0) {
            return res.status(200).json({ data: [] })
        }

        const groups = result
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