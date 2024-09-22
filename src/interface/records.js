
import verify from "../kernel/verify.js";
import { write, read, vote, readOne, writeComment, writeCurrentCalls, writeHistory, deleteRecord, editRecord } from "../kernel/records.js";

const records = {
  "/write": {
  	 method: "POST",
  	 workers: [verify, write]
  },
  "/read": {
  	 method: "GET",
  	 workers: [read]
  },
  "/readOne": {
  	 method: "GET",
  	 workers: [readOne]
  },
  "/writeComment": {
  	 method: "POST",
  	 workers: [writeComment]
  },
  "/writeCurrentCalls": {
  	 method: "POST",
  	 workers: [verify, writeCurrentCalls]
  },
  "/writeHistory": {
  	 method: "POST",
  	 workers: [verify, writeHistory]
  }, 
  "/delete": {
  	 method: "DELETE",
  	 workers: [verify, deleteRecord]
  },
  "/vote":  {
  	 method: "PUT",
  	 workers: [vote]
  },
  "/edit":  {
  	 method: "PUT",
  	 workers: [verify, editRecord]
  }
}

export default records;
