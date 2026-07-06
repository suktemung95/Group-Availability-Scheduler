const runQuery = require("../db/pool");
const utils = require("../utils/utils");
const { sendSuccess, sendError } = require("../utils/responses")
const authPool = require('../db/auth.db')

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendError(res, 400, "Invalid input")
  }

  try {
    // validate not existing user
    const user = await authPool.getUserByName([username])
    
    if (user.length > 0) {
      return sendError(res, 409, "User already exists")
    }

    // hash password
    const passwordHash = await utils.hashPassword(password);

    // insert user into database
    const result = await authPool.createUser([username, passwordHash])

    // return success
    return sendSuccess(res, 201, "Account registered successfully!", result[0])
  } catch (err) {
    return sendError(res, 500, "Something went wrong")
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, 400, "Invalid input")
    }

    // get password for username in database
    const result = await authPool.getUserByName([username])
      
    if (result.length === 0) {
      return sendError(res, 401, "Invalid login credentials")
    }
      
    const user = result[0]
    const isValidPassword = await utils.comparePassword(password, user.password_hash)

    if (isValidPassword) {
      const token = utils.generateJWT(user)
      return sendSuccess(res, 200, "Login successful", token)
    }
    return sendError(res, 401, "Invalid login credentials")
  } catch (err) {
    return sendError(res, 500, "Database error")
  }
}