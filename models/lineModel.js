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
        console.log(line.value.line)
      if (line.value.line.length === 1) {
        const newLine = await this.linesCollection.findOneAndUpdate(
          { _id: ObjectID(id), "line.waitTime" : 0 },
          { $set: { "line.$.serviceStartTime": new Date().getTime() } }
        );
      }
      return newLine.value;
    } catch {
      return false;
    }
  };

  serveNextCustomer = async (lineId) => {
    try {
      const line = await this.linesCollection.findOne({
        _id: ObjectID(lineId),
      });
      const servedCustomer = line.line[0];
      const serviceTime = (
        (new Date().getTime() - servedCustomer.serviceStartTime) /
        60000
      ).toFixed(0);
      const waitTime = (
        (servedCustomer.serviceStartTime - servedCustomer.joinTime) /
        60000
      ).toFixed(0);
      const newLine = await this.linesCollection.findOneAndUpdate(
        { _id: ObjectID(lineId) },
        {
          $pop: { line: -1 },
          $push: { serviceTimes: serviceTime, waitTimes: waitTime },
        }
      );
      return newLine.value;
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
};
