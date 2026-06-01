const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

async function hashPassword(password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
}
async function comparePassword(user, password) {
  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid;
}

function generateJWT(user) {

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token
}

module.exports = {
  hashPassword,
  comparePassword,
  generateJWT,
};
MY 