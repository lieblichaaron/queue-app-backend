require("dotenv").config();
const express = require("express");
const app = express();
const mongoUtil = require("./utils/dbConnection");

mongoUtil.connectToDb(function (err, client) {
  if (err) console.log(err);
  if (!err) {
    console.log("Connected correctly to db");
    const lineRouter = require("./routes/lineRouter");
    const lineOwnerRouter = require("./routes/lineOwnerRouter");

    app.use(express.json());

    app.use("/owner", lineOwnerRouter);
    app.use("/line", lineRouter);

    let port = process.env.PORT;
    if (port == null || port == "") {
      port = 5000;
    }
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  }
});
