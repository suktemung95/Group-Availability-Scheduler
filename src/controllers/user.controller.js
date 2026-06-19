const runQuery = require("../db/pool")
const userServices = require("../services/user.services")
const userPool = require("../db/user.db")

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
    
    const user1 = Number(req.user.userId)
    const user2 = Number(req.params.userId)

    const freeBlocks = await userPool.getTwoUserFreeBlocks(user1, user2)
    const overlap = userServices.findUserOverlap(freeBlocks, user1, user2)

    return res.status(200).json({
        free_time: overlap
    })
}