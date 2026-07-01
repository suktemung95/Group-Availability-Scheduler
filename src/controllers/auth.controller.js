const runQuery = require("../db/pool");
const utils = require("../utils");
const authPool = require('../db/auth.db')

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid Input" });
  }

  try {
    // validate not existing user
    const user = await authPool.getUserByName([username])
    
    if (user.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // hash password
    const passwordHash = await utils.hashPassword(password);

    // insert user into database
    const result = await authPool.createUser([username, passwordHash])

    // return success
    res.status(201).json({
      message: "Account Registered Successfully!",
      data: result[0]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Invalid Input" });
    }

    // get password for username in database
    const result = await authPool.getUserByName([username])
      
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid login credentials" })
    }
      
    const user = result[0]
    const isValidPassword = await utils.comparePassword(password, user.password_hash)

    if (isValidPassword) {
      const token = utils.generateJWT(user)
      return res.status(200).json({
        message: "Login Successful",
        token: token
      })
    }
    return res.status(401).json({ error: "Invalid login credentials" })
  } catch (err) {
    return res.status(500).json({ error: "Database error"})
  }
}