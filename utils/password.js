const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (plain, hashed) => {
  const isValid = await bcrypt.compare(plain, hashed);
  console.log({ isValid, plain, hashed });
  return isValid;
};

module.exports = {
  hashPassword,
  comparePassword,
};
