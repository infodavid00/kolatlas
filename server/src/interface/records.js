
import express from "express";
import verify from "../kernel/verify.js";
import { write, read, vote, readOne, writeComment, writeCalls, deleteRecord, editRecord } from "../kernel/records.js";

const records = express.Router();


records.post("/write", verify, write)
records.get("/read", read)
records.get("/readOne", readOne)
records.post("/writeComment", writeComment)
records.post("/writeCalls", verify, writeCalls)
records.delete("/delete", verify, deleteRecord)
records.put("/vote", vote)
records.put("/edit", verify, editRecord)
// 
// const records = {
  // "/write": {
  	 // method: "POST",
  	 // workers: [verify, write]
  // },
  // "/read": {
  	 // method: "GET",
  	 // workers: [read]
  // },
  // "/readOne": {
  	 // method: "GET",
  	 // workers: [readOne]
  // },
  // "/writeComment": {
  	 // method: "POST",
  	 // workers: [writeComment]
  // },
  // "/writeCurrentCalls": {
  	 // method: "POST",
  	 // workers: [verify, writeCurrentCalls]
  // },
  // "/writeHistory": {
  	 // method: "POST",
  	 // workers: [verify, writeHistory]
  // },
  // "/delete": {
  	 // method: "DELETE",
  	 // workers: [verify, deleteRecord]
  // },
  // "/vote":  {
  	 // method: "PUT",
  	 // workers: [vote]
  // },
  // "/edit":  {
  	 // method: "PUT",
  	 // workers: [verify, editRecord]
  // }
// }

export default records;
