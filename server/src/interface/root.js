
import express from "express";
import records from "./records.js";


const app = express();

app.get("/", (_, response)=> {
   	response.status(200).send("OK \r\n");
});
app.use("/records", records);

export default app;
