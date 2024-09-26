
import express from "express";
import verify from "../kernel/verify.js";
import { write, read, deleteRecord, readOne, editRecord, writeActivity, readNames } from "../kernel/tokens.js";

const tokens = express.Router();
 
tokens.post("/write", verify, write)
tokens.get("/read", read)
tokens.get("/readNames", readNames)
tokens.delete("/delete", verify, deleteRecord)
tokens.get("/readOne", readOne)
tokens.put("/edit", verify, editRecord)
tokens.post("/writeActivity", verify, writeActivity)

export default tokens;
