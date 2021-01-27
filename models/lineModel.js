const mongoUtil = require("../utils/dbConnection");
const { ObjectID } = require("mongodb");

module.exports = class Line {
  constructor() {
    this.linesCollection = mongoUtil.getDb().collection("lines");
  }
  addLine = async (lineData) => {
    try {
      const newLineCursor = await this.linesCollection.insertOne(lineData);
      const newLine = newLineCursor.ops[0];
      return newLine;
    } catch (err) {
      return false;
    }
  };

  getLineById = async (id) => {
    try {
      const line = await this.linesCollection.findOne({
        _id: ObjectID(id),
      });
      return line;
    } catch {
      return false;
    }
  };

  getLineById = async (id) => {
    try {
      const line = await this.linesCollection.findOne({
        _id: ObjectID(id),
      });
      return line;
    } catch {
      return false;
    }
  };
  getLineByIdOnChange = async (id) => {
    try {
      const line = await this.linesCollection.watch(
        [{ $match: { "fullDocument._id": ObjectID(id) } }],
        {
          fullDocument: "updateLookup",
        }
      );
      const next = await line.next();
      return next.fullDocument;
    } catch {
      return false;
    }
  };
  addShopperToLine = async (id, shopper) => {
    try {
      const line = await this.linesCollection.findOneAndUpdate(
        { _id: ObjectID(id) },
        { $push: { line: shopper } },
        { returnOriginal: false }
      );
      return line;
    } catch {
      return false;
    }
  };

  removeShopperFromLine = async (id, shopper) => {
    try {
      const line = await this.linesCollection.findOneAndUpdate(
        { _id: ObjectID(id) },
        { $pull: { line: shopper } },
        { returnOriginal: false }
      );
      return line;
    } catch {
      return false;
    }
  };

  getLinesByOwnerId = async (ownerId) => {
    try {
      const cursor = await this.linesCollection.find({ ownerId });
      const lines = await cursor.toArray();
      return lines;
    } catch (err) {
      return err.stack;
    }
  };

  addShopperToLine = async (id, shopper) => {
    try {
      const line = await this.linesCollection.findOneAndUpdate(
        { _id: ObjectID(id) },
        { $push: { line: shopper } },
        { returnOriginal: false }
      );
      return line;
    } catch {
      return false;
    }
  };

  removeShopperFromLine = async (id, shopper) => {
    try {
      const line = await this.linesCollection.findOneAndUpdate(
        { _id: ObjectID(id) },
        { $pull: { line: shopper } },
        { returnOriginal: false }
      );
      return line;
    } catch {
      return false;
    }
  };
};
