const runQuery = require("../db/pool");
exports.getUserByName = async (values) => {
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await runQuery(query, values);
    return result
}

exports.createUser = async (values) => {
    const query = `INSERT INTO users (created_at, username, password_hash)
            VALUES (NOW(), $1, $2)
            RETURNING *`;
    const result = await runQuery(query, values);
    return result
}