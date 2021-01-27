const mongoUtil = require("../utils/dbConnection");
const { ObjectID } = require("mongodb");
const validate = require("../controllers/validator");

module.exports = class LineOwner {
  constructor() {
    this.lineOwnersCollection = mongoUtil.getDb().collection("lineOwners");
    this.linesCollection = mongoUtil.getDb().collection("lines");
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

  getLinesByOwnerId = async (ownerId) => {
    const lineIds = await this.lineOwnersCollection.findOne(
      { _id: ObjectID(ownerId) },
      { projection: { _id: 1, lines: 1 } }
    );
    if (!lineIds.lines) return [];
    const lineObjectIds = lineIds.lines.map((id) => ObjectID(id));
    const cursor = await this.linesCollection.find({
      _id: { $in: lineObjectIds },
    });
    const lines = await cursor.toArray();
    return lines;
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
      const newUser = await this.lineOwnersCollection.findOneAndUpdate(
        filter,
        updateDoc,
        { returnOriginal: false }
      );
      return newUser.value;
    } catch (err) {
      return err.stack;
    }
  };
  changeLineOwnerPassword = async (email, password) => {
    const filter = { email };
    const updateDoc = {
      $set: { password },
    };
    try {
      const newUser = await this.lineOwnersCollection.findOneAndUpdate(
        filter,
        updateDoc,
        { returnOriginal: false }
      );
      return newUser.value;
    } catch (err) {
      return err.stack;
    }
  };
};
