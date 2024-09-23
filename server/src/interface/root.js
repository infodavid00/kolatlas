
import express from "express";
import records from "./records.js";
import tokens from "./tokens.js";

const app = express();

app.get("/", (_, response)=> {
   	response.status(200).send("OK \r\n");
});
app.use("/records", records);
app.use("/tokens", tokens);

export default app;
