
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
        projection.image = 1;

    }
    const data = await db().target("records").find({}, {
         projection 
    }).skip(page).limit(size).sort({ date: -1 }).toArray();
  	response.send(200, "application/json", { ack: true, data });
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}

export async function readOne(request, response) {
  try {
    const data = await db().target("records").findOne({ _id: new ObjectId(request.queryStrings?.id) });
    if (data)
       response.send(200, "application/json", { ack: true, data });
    else 
       response.send(404, "application/json", { ack: false });
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}

export async function writeComment(request, response) {
  try {
    const data = await db().target("records").updateOne({ _id: new ObjectId(request.queryStrings?.id) }, {
    	 $push: { comments: request.body }
    });
    response.send(200, "application/json", { ack: true });
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}

export async function writeCurrentCalls(request, response) {
  try {
    const data = await db().target("records").updateOne({ _id: new ObjectId(request.queryStrings?.id) }, {
    	 $push: { currentCallsList: request.body }
    });
    response.send(200, "application/json", { ack: true });
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}

export async function writeHistory(request, response) {
  try {
    const data = await db().target("records").updateOne({ _id: new ObjectId(request.queryStrings?.id) }, {
    	 $push: { history: request.body }
    });
    response.send(200, "application/json", { ack: true });
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}

export async function deleteRecord(request, response) {
  try {
    await db().target("records").deleteOne({ _id: new ObjectId(request.queryStrings?.id) });
    response.send(200, "application/json", { ack: true });
  } catch(error) {
  	response.send(500, "application/json", { ack: false, message: error.message});
  }	
}

export async function editRecord(request, response) {
  try {
    const body = JSON.parse(request.body);
    const recordToupdate = {}; 
        
    if (body["name"]) recordToupdate["name"] = body.name;
    if (body["x"]) recordToupdate["x"] = body.x;
    if (body["tg"]) recordToupdate["tg"] = body.tg;
    if (body["chains"]) recordToupdate["chains"] = body.chains;
    if (body["currentCalls"]) recordToupdate["currentCalls"] = body.currentCalls;
    if (body["image"]) recordToupdate["image"] = body.image;
    if (body["currentCallsList"]) recordToupdate["currentCallsList"] = body.currentCallsList;
    if (body["history"]) recordToupdate["history"] = body.history;
    
    await db().target("records").updateOne({ _id: new ObjectId(request.queryStrings?.id) }, { $set: {...recordToupdate}})
    response.send(200, "application/json", { ack: true });
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
