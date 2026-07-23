const jwt = require('jsonwebtoken')
const { sendError, sendSuccess } = require("../utils/responses")

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return sendError(res, 401, "Missing AuthHeader / JWT")
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return sendError(res, 401, "Invalid token format")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (err) {
        return sendError(res, 401, "Invalid or expired token")
    }
}

module.exports = authMiddleware