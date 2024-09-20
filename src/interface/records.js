
import verify from "../kernel/verify.js";
import { write, read, vote, readOne, writeComment } from "../kernel/records.js";

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
  "/vote":  {
  	 method: "PUT",
  	 workers: [vote]
  }
}

export default records;
