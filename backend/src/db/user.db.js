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
        FROM users WHERE username = $1
        `
    return await runQuery(query, values)
}


