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
      return newLine._id;
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
};
