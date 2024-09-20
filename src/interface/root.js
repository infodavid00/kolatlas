
import records from "./records.js";

const root = {
  "/": {
     method: "GET",
   	 workers: [((_, response)=> {
   	 	response.send(200, "text/plain", "OK \r\n");
   	 })]
  },
  "/records": {
  	workers: records
  }
}

export default root;
