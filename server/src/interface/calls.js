
import express from "express";
import verify from "../kernel/verify.js";
import { write, read, readSpecific, deleteRecord, editRecord } from "../kernel/calls.js";

const calls = express.Router(); 

calls.post("/write", verify, write)
calls.get("/read", read)
calls.get("/readSpecific", readSpecific)
calls.delete("/delete", verify, deleteRecord)
calls.put("/edit", verify, editRecord)

export default calls;
