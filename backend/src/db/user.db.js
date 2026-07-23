const runQuery = require('./pool')

exports.getMe = async (values) => {
    const query = `
        SELECT id, username, created_at
        FROM users WHERE id = $1
        `
    return await runQuery(query, values)
}

exports.getMeByName = async (values) => {
  const query = `
    SELECT id, username, created_at
    FROM users
    WHERE LOWER(username) = LOWER($1)
    LIMIT 1
  `
  return await runQuery(query, values)
}


