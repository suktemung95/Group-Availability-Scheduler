const runQuery = require("../db/pool")
const userServices = require("../services/user.services")
const userPool = require("../db/user.db")

exports.postGroup = async (req, res) => {

    try {
        // make group
        const user_id = req.user.userId
        const { name } = req.body
        const makeQuery = `INSERT INTO groups (name, created_by)
        VALUES ($1, $2) RETURNING *`
        let values = [name, user_id]
        const makeResult = await runQuery(makeQuery, values)
        const group_id = makeResult[0].id
        
        // add self to group
        const addQuery = `INSERT INTO group_members (group_id, user_id)
        VALUES ($1, $2) RETURNING *`
        values = [group_id, user_id]
        const result = await runQuery(addQuery, values)
        return res.status(201).json({
            data: result[0],
            group: makeResult[0]
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

        if (result.length === 0) {
            return res.status(409).json({
                error: "User is already a member of this group"
            });
        }
            
        return res.status(201).json({
            success: "Added member to group",
            data: result[0]
        })
    } catch (err) {
        return res.status(500).json({ error: "Database error" })
    }
}

exports.getGroupMembers = async (req, res) => {

    try {
        const groupId = Number(req.params.groupId)
        const members = await userPool.getGroupMembers(groupId)

        return res.status(200).json({ members: members })
    } catch (err) {
        return res.status(500).json({ error: "Database Error" })
    }
}

exports.getGroupOverlap = async (req, res) => {

    try {
        const groupId = Number(req.params.groupId)
        
        const members = await userPool.getGroupMembers(groupId);
        const memberIds = members.map(member => Number(member.user_id));

        if (memberIds.length === 0) {
            return res.status(404).json({ error: "Group has no members" });
        }

        const freeBlocks = await userPool.getGroupFreeBlocks(groupId);

        const overlap = userServices.findGroupOverlap(freeBlocks, memberIds);
        return res.status(200).json({
            free_time: overlap
        })
    } catch (err) {
        return res.status(500).json({ error: "Database Error" });
    }
}