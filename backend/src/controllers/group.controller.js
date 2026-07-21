const groupPool = require("../db/group.db")
const userPool = require("../db/user.db")
const userServices = require("../services/user.services")
const { sendSuccess, sendError } = require("../utils/responses")

exports.postGroup = async (req, res) => {

    try {
        // make group
        const user_id = req.user.userId
        const { name, description } = req.body
        const groupResult = await groupPool.makeGroup([name, user_id, description])
        const group_id = groupResult[0].id
        
        // add self to group
        const result = await groupPool.joinGroup([group_id, user_id, 'owner'])
        return sendSuccess(res, 201, "Succesfully created group",
            {
                group: result[0],
                membership: groupResult[0]
            }
        )
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.joinGroup = async (req, res) => {

    try {
        const user_id = req.user.userId
        const group_id = req.params.groupId

        const result = await groupPool.joinGroup([group_id, user_id, 'member'])

        if (result.length === 0) {
            return sendError(res, 409, "User is already a member of this group")
        }
         
        return sendSuccess(res, 201, "Added member to group", result[0])
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.leaveGroup = async (req, res) => {
    try {
        const id = req.user.userId
        const groupId = Number(req.params.groupId)

        const result = await groupPool.leaveGroup([id, groupId])

        return sendSuccess(res, 200, "User successfully removed from group", result[0])

    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.getGroupMembers = async (req, res) => {

    try {
        const groupId = Number(req.params.groupId)
        const members = await groupPool.getGroupMembers([groupId])

        return sendSuccess(res, 200, "Group members sucessfully returned", members)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.getGroupOverlap = async (req, res) => {
    try {
        const groupId = Number(req.params.groupId);

        if (Number.isNaN(groupId)) {
            return sendError(res, 400, "Invalid group id")
        }

        const members = await groupPool.getGroupMembers([groupId]);
        const memberIds = members.map(member => Number(member.user_id));

        if (memberIds.length === 0) {
            return sendError(res, 404, "Group has no members")
        }

        const freeBlocks = await groupPool.getGroupFreeBlocks([groupId]);

        const overlap = userServices.findGroupOverlap(freeBlocks, memberIds);

        return sendSuccess(res, 200, "Group overlap successfully returned", overlap)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
};

exports.inviteUser = async (req, res) => {
    try {
        const inviter = req.user.userId
        const invitee_name = req.params.username
        const groupId = req.params.groupId

        const invitees = await userPool.getMeByName([invitee_name])
        const invitee = invitees[0]

        const result = await groupPool.makeInvite([inviter, invitee.id, groupId])

        if (result.length === 0) {
            return sendError(res, 400, "Failed to invite user")
        }
        
        return sendSuccess(res, 200, "Successfully invited user to group", result[0])
        } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.getUserGroups = async (req, res) => {
    try {
        const id = req.user.userId
        const result = await groupPool.getUserGroups([id])

        return sendSuccess(res, 200, "Successfully returned user groups", result)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}

exports.getMutualMembers = async (req, res) => {
    try {
        const id = req.user.userId

        const result = await groupPool.getMutualMembers([id])

        return sendSuccess(res, 200, "Successfully returned user groups", result)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
}