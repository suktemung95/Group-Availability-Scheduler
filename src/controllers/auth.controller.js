const runQuery = require("../db/pool");
const utils = require("../utils/utils");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid Input" });
  }

  try {
    // validate not existing user
    let query = `SELECT id FROM users WHERE username = $1`;
    let values = [username];
    let result = await runQuery(query, values);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // hash password
    const passwordHash = await utils.hashPassword(password);

    // insert user into database
    query = `INSERT INTO users (created_at, username, password_hash)
        VALUES (NOW(), $1, $2)`;
    values = [username, passwordHash];
    result = await runQuery(query, values);

    // return success
    res.status(201).json({ message: "Account Registered Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.login = async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid Input" });
  }

  // get password for username in database
  const query = `SELECT id, username, password_hash FROM users
  WHERE username = $1`
  const values = [username]

  const result = await runQuery(query, values)
  
  if (result.rows.length === 0) {
    return res.status(401).json( {error: "Invalid login credentials"} )
  }
  
  const user = result.rows[0]
  const isValidPassword = await utils.comparePassword(user, password)

  if (isValidPassword) {
    const token = utils.generateJWT(user)
    return res.status(200).json({
      message: "Login Successful",
      token: token
    })
  }
  return res.status(401).json({ error: "Invalid login credentials" })
}