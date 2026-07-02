const groupPool = require("../db/group.db")
const userServices = require("../services/user.services")

exports.postGroup = async (req, res) => {

    try {
        // make group
        const user_id = req.user.userId
        const { name } = req.body
        const groupResult = await groupPool.makeGroup([name, user_id])
        const group_id = groupResult[0].id
        
        // add self to group
        const result = await groupPool.joinGroup([group_id, user_id, 'owner'])
        return res.status(201).json({
            data: result[0],
            group: groupResult[0]
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

        const result = await groupPool.joinGroup([group_id, user_id, 'member'])

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

exports.leaveGroup = async (req, res) => {
    try {
        const id = req.user.userId
        const groupId = Number(req.params.groupId)

        const result = await groupPool.leaveGroup([id, groupId])

        return res.status(200).json({
            success: "User successfully removed from group",
            data: result[0]
        })

    } catch (err) {
        return res.status(500).json({ error: "Database error" })
    }
}

exports.getGroupMembers = async (req, res) => {

    try {
        const groupId = Number(req.params.groupId)
        const members = await groupPool.getGroupMembers([groupId])

        return res.status(200).json({ members: members })
    } catch (err) {
        return res.status(500).json({ error: "Database Error" })
    }
}

exports.getGroupOverlap = async (req, res) => {
    try {
        const groupId = Number(req.params.groupId);

        if (Number.isNaN(groupId)) {
            return res.status(400).json({ error: "Invalid group id" });
        }

        const members = await groupPool.getGroupMembers([groupId]);
        const memberIds = members.map(member => Number(member.user_id));

        if (memberIds.length === 0) {
            return res.status(404).json({ error: "Group has no members" });
        }

        const freeBlocks = await groupPool.getGroupFreeBlocks([groupId]);

        const overlap = userServices.findGroupOverlap(freeBlocks, memberIds);

        return res.status(200).json({
            free_time: overlap
        });
    } catch (err) {
        return res.status(500).json({
            error: "Database Error"
        });
    }
};

exports.inviteUser = async (req, res) => {
    try {
        const inviter = req.user.userId
        const invitee = req.params.userId
        const groupId = req.params.groupId

        const result = await groupPool.makeInvite([inviter, invitee, groupId])

        if (result.length === 0) {
            return res.status(400).json({ error: "Failed to invite user" })
        }
        
        return res.status(200).json({ success: "Successfully invited user to group"})
    } catch (err) {
        return res.status(500).json({ error: "Database error"})
    }
}