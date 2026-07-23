const groupPool = require("../db/group.db")
const userPool = require("../db/user.db")
const schedulePool = require("../db/schedule.db")
const scheduleServices = require("../services/schedule.services")
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

        const overlap = scheduleServices.findGroupOverlap(freeBlocks, memberIds);

        return sendSuccess(res, 200, "Group overlap successfully returned", overlap)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
};

exports.inviteUser = async (req, res) => {
  try {
    const inviterId = req.user.userId
    const inviteeName = req.params.username
    const groupId = Number(req.params.groupId)

    if (!inviteeName || !groupId) {
      return sendError(res, 400, "Username and group ID are required")
    }

    const invitees = await userPool.getMeByName([inviteeName])

    if (invitees.length === 0) {
      return sendError(res, 404, "User not found")
    }

    const invitee = invitees[0]

    if (Number(invitee.id) === Number(inviterId)) {
      return sendError(res, 400, "You cannot invite yourself")
    }

    const result = await groupPool.makeInvite([
      inviterId,
      invitee.id,
      groupId,
    ])

    if (result.length === 0) {
      return sendError(res, 400, "Failed to invite user")
    }

    return sendSuccess(
      res,
      201,
      "Successfully invited user to group",
      result[0]
    )
  } catch (err) {
    console.error("Invite user error:", err)

    if (err.code === "23505") {
      return sendError(res, 409, "This user has already been invited")
    }

    if (err.code === "23503") {
      return sendError(res, 400, "Invalid user or group")
    }

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

exports.getOverlap = async (req, res) => {
    try {
        const user1 = Number(req.user.userId);
        const user2 = Number(req.params.userId);

        if (Number.isNaN(user2)) {
            return sendError(res, 400, "Invalid user id")
        }

        const freeBlocks = await schedulePool.getTwoUserFreeBlocks(user1, user2);

        const overlap = scheduleServices.findGroupOverlap(freeBlocks, [user1, user2]);

        return sendSuccess(res, 200, "Successfully returned overlap", overlap)
    } catch (err) {
        return sendError(res, 500, "Database error")
    }
};