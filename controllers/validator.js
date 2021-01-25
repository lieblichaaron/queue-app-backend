const bcrypt = require("bcrypt");

module.exports = class Validator {
  InvalidPasswordError(message) {
<<<<<<< HEAD
    let error = new Error(message);
    error.name="InvalidPasswordError"
    return error;
  }

  UnavailableEmailError(message) {
    let error = new Error(message);
    error.name="UnavailableEmailError"
=======
    const error = new Error(message);
>>>>>>> e786cb242e78a63a7390d06cd9d1aa797080bbae
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
