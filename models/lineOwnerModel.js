const mongoUtil = require("../utils/dbConnection");
const { ObjectID } = require("mongodb");
const validate = require("../controllers/validator");

module.exports = class LineOwner {
  constructor() {
    this.lineOwnersCollection = mongoUtil.getDb().collection("lineOwners");
  }
  addLineOwner = async (ownerData) => {
    try {
      const newOwnerCursor = await this.lineOwnersCollection.insertOne(
        ownerData
      );
      const newOwner = newOwnerCursor.ops[0];
      return newOwner;
    } catch (err) {
      return err.stack;
    }
  };
  getLineOwnerByEmail = async (email) => {
    try {
      const lineOwner = await this.lineOwnersCollection.findOne({ email });
      return lineOwner;
    } catch (err) {
      return err.stack;
    }
  };
  getLineOwnerById = async (id) => {
    try {
      const lineOwner = await this.lineOwnersCollection.findOne({
        _id: ObjectID(id),
      });
      return lineOwner;
    } catch (err) {
      return err.stack;
    }
  };
  changeLineOwnerSettings = async (accountSettings, oldEmail) => {
    /**
     * @param {Object} accountSettings - Changes to user settings
     * @param {string} [accountSettings.email] - User's new email address
     * @param {string} [accountSettings.displayName] - User's new display name
     * @param {string} oldEmail - User's current email address
     */

    const filter = { email: oldEmail };
    let updateDoc = {
      $set: {},
    };
    if (accountSettings.email && accountSettings.email !== oldEmail) {
      const existingUser = await this.getLineOwnerByEmail(
        accountSettings.email
      );
      if (existingUser) throw new Error("Email address is taken");
      else updateDoc.$set.email = accountSettings.email;
    }
    if (accountSettings.displayName)
      updateDoc.$set.displayName = accountSettings.displayName;

    try {
      await this.lineOwnersCollection.findOneAndUpdate(filter, updateDoc);
    } catch (err) {
      return err.stack;
    }
  };
  changeLineOwnerPassword = async (updateObject) => {
    /**
     * @param {Object} updateObject - Changes to user settings
     * @param {string} updateObject.id
     * @param {string} updateObject.oldPassword
     * @param {string} updateObject.newPassword
     */

    const filter = { _id: ObjectID(updateObject.id) };
    const projection = { password: 1 };
    try {
      const user = await this.lineOwnersCollection.findOne(filter);
    } catch (err) {
      return err.stack;
    }
    const isCorrectPassword = await validate.comparePasswordHash(
      updateObject.oldPassword,
      user.password
    );
    if (!isCorrectPassword) {
      return validate.InvalidPasswordError("incorrect password");
    }
    const updateDoc = {
      $set: {
        password: hashedPassword,
      },
    };
    try {
      await this.lineOwnersCollection.findOneAndUpdate(filter, updateDoc);
    } catch (err) {
      return err.stack;
    }
  };
};
