
import db from "../etc/db.conf.js";
import { ObjectId } from "mongodb";

export async function write(request, response) {
  try {
    await db().target("records").insertOne({ ...request.body, votes: 0 });
  	response.send(200, "application/json", { ack: true });  
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}

export async function read(request, response) {
  try {
    const size = Number(request.queryStrings?.size) || 15;
    const page = Number(request.queryStrings?.page) * size || 0;
    const projection = {};
    if (request.queryStrings?.limited) {
        projection.name = 1;
        projection.x = 1;
        projection.tg = 1;
        projection.chains = 1;
        projection.currentCalls = 1;
        projection.votes = 1;
    }
    const data = await db().target("records").find({}, {
    	projection
    }).skip(page).limit(size).sort().toArray();
  	response.send(200, "application/json", { ack: true, data });
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}



export async function vote(request, response) {
  try {
    await db().target("records").updateOne({ _id:  new ObjectId(request.queryStrings?.id) }, { $inc: { votes: Number(request.queryStrings?.count) ?? 1 } });
  	response.send(200, "application/json", { ack: true });  
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}
