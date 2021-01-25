const bcrypt = require("bcrypt");

module.exports = class Validator {
  InvalidPasswordError(message) {
    const error = new Error(message);
    return error;
  }

  async comparePasswordHash(password, hashedPassword) {
    const isValid = await bcrypt.compare(
      password,
      hashedPassword,
      (err, result) => {
        if (err) return false;
        if (result) {
          return true;
        }
      }
    );
    return isValid;
  }
};
