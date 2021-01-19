const mongoUtil = require("../utils/dbConnection");

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
};
