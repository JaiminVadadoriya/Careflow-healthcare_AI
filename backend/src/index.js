// require('dotenv').config({path:'./env'});
import dotenv from "dotenv";

import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server listening on port " + process.env.PORT || 8000);
    });
  })
  .catch((error) => {
    console.log("MONGO db connect failed: " + error);
  });

/* import express from "express";
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log("APP listening on port " + process.env.PORT);
    });
  } catch (error) {
    console.error("ERROR: ", Error);
  }
})();
 */
