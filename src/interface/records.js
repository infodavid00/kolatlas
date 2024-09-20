
import verify from "../kernel/verify.js";
import { write, read, vote } from "../kernel/records.js";

const records = {
  "/write": {
  	 method: "POST",
  	 workers: [verify, write]
  },
  "/read": {
  	 method: "GET",
  	 workers: [read]
  },
  "/vote":  {
  	 method: "PUT",
  	 workers: [vote]
  }
}

export default records;
