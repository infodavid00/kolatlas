
export default function verify(request, response, worker) { 
  try {
    const password = request.headers["x-application-password"];
  	if (password) {
  	  if (password === process.env.ADMINPASSWORD) {
  	  	worker.nextWorker();
  	  }	else {
  	    response.send(401, "application/json", { ack: false, message: "Incorrect password"}); 	
  	  }
  	} else {
      response.send(400, "application/json", { ack: false, message: "Invalid request"}); 
  	}
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }
}
