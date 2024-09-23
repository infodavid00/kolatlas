import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./src/etc/db.conf.js";
import root from "./src/interface/root.js";
import records from "./src/interface/records.js";

const application = express();

console.log("starting server....");

application.use(cors());
application.use(express.json());
application.use("/", root);
application.use("/records", records);

await db(process.env.DBKEY).connect();

application.listen(8080, () => console.log("started on :8080"));
