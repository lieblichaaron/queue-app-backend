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
      let newLine;
      if (line.value.line.length === 1) {
        newLine = await this.linesCollection.findOneAndUpdate(
          { _id: ObjectID(id), "line.waitTime": 0 },
          { $set: { "line.$.serviceStartTime": new Date().getTime() } }
        );
        return newLine.value;
      }
      return line.value;
    } catch {
      return false;
    }
  };

  setLineActiveStatus = async (lineId, isActive) => {
    try {
      const line = await this.linesCollection.findOneAndUpdate(
        {
          _id: ObjectID(lineId),
        },
        { $set: { isActive } }
      );
      return { isActive };
    } catch {
      return false;
    }
  };

  calcAvgServiceAndWait = (serviceTimes, waitTimes) => {
    const avgServiceTime = Math.floor(
      serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length
    );
    const avgWaitTime = Math.floor(
      waitTimes.reduce((a, b) => a + b, 0) / serviceTimes.length
    );
    return { avgServiceTime, avgWaitTime };
  };

  serveNextCustomer = async (lineId) => {
    try {
      const line = await this.linesCollection.findOne({
        _id: ObjectID(lineId),
      });

      // handle serve next when no line exists
      if (!line.line || line.line.length === 0) {
        const serviceTimes = line.serviceTimes;
        const waitTimes = line.waitTimes;
        if (!serviceTimes) {
          return {avgServiceTime: line.estServiceTime, avgWaitTime: 0}
        }
        return this.calcAvgServiceAndWait(serviceTimes, waitTimes);
      }

      // get prev customer's service time and wait time
      const servedCustomer = line.line[0];
      const serviceTime =
        Math.ceil(new Date().getTime() - servedCustomer.serviceStartTime) /
        60000;
      const waitTime =
        Math.ceil(servedCustomer.serviceStartTime - servedCustomer.joinTime) /
        60000;

      // remove served customer from line and push their service and wait times
      const newLine = await this.linesCollection.findOneAndUpdate(
        { _id: ObjectID(lineId), "line.number": servedCustomer.number },
        {
          $pop: { line: -1 },
          $push: { serviceTimes: serviceTime, waitTimes: waitTime },
        },
        { returnOriginal: false }
      );

      // set next customer's service start time
      if (newLine.value && newLine.value.line.length > 0) {
        const nextCustNumber = line.line[1].number;
        await this.linesCollection.updateOne(
          { _id: ObjectID(lineId), "line.number": nextCustNumber },
          { $set: { "line.$.serviceStartTime": new Date().getTime() } }
        );
      }

      // calc new average service times and wait times
      const serviceTimes = newLine.value.serviceTimes;
      const waitTimes = newLine.value.waitTimes;
      return this.calcAvgServiceAndWait(serviceTimes, waitTimes);
    } catch (err) {
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
