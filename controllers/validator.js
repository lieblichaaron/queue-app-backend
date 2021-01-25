const bcrypt = require("bcrypt");

module.exports = class Validator {
  InvalidPasswordError(message) {
    let error = new Error(message);
    error.name="InvalidPasswordError"
    return error;
  }

  UnavailableEmailError(message) {
    let error = new Error(message);
    error.name="UnavailableEmailError"
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
