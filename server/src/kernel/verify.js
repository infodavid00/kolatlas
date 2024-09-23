
export default function verify(request, response, next) { 
  try {
    const password = request.headers["x-application-password"];
  	if (password) {
  	  if (password === process.env.ADMINPASSWORD) {
  	  	next();
  	  }	else {	
  	    response.status(401).json({ ack: false, message: "Incorrect password"});
  	  }
  	} else {
      response.status(400).json({ ack: false, message: "Invalid request"});
  	}
  } catch(error) {
  	response.status(500).json({ ack: false, message: error.message});
  }
}
