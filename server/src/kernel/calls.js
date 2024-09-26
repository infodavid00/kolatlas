import db from "../etc/db.conf.js";
import { ObjectId } from "mongodb";

export async function write(request, response) {
  try {
    await db().target("calls").insertOne({ ...request.body  });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function read(request, response) {
  try {
    const size = Number(request.query.size) || 15;
    const page = Number(request.query.page) * size || 0;
    const data = await db().target("calls").find({})
      .skip(page).limit(size).sort({ date: -1 }).toArray();
    response.status(200).json({ ack: true, data });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function readSpecific(request, response) {
  try {
    const id = request.query.id;
    const data = await db().target("calls").find({ kol: id }).sort({ date: -1 }).toArray();
    response.status(200).json({ ack: true, data });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}



export async function deleteRecord(request, response) {
  try {
    await db().target("calls").deleteOne({ _id: new ObjectId(request.query.id) });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function editRecord(request, response) {
  try {
    const body = request.body;
    const recordToUpdate = {};
  	 
    if (body.kol) recordToUpdate.kol = body.kol;
    if (body.token) recordToUpdate.token = body.token;
    if (body.chain) recordToUpdate.chain = body.chain;    
    if (body.ca) recordToUpdate.ca = body.ca;    
    if (body.link) recordToUpdate.link = body.link;    
    if (body.dd) recordToUpdate.dd = body.dd;    
    if (body.initial) recordToUpdate.initial = body.initial;
    if (body.price) recordToUpdate.price = body.price;    
    if (body.fhperf) recordToUpdate.fhperf= body.fhperf;
    if (body.fdperf) recordToUpdate.fdperf = body.fdperf;    
    if (body.fwperf) recordToUpdate.fwperf = body.fwperf;
    if (body.fmperf) recordToUpdate.fmperf = body.fmperf;
    if (body.tocurrent) recordToUpdate.tocurrent = body.tocurrent;
    if (body.fhprice) recordToUpdate.fhprice = body.fhprice;
    if (body.fdprice) recordToUpdate.fdprice = body.fdprice;    
    if (body.fwprice) recordToUpdate.fwprice = body.fwprice;
    if (body.fmprice) recordToUpdate.fmprice = body.fmprice; 

    await db().target("calls").updateOne({ _id: new ObjectId(request.query.id) }, { $set: { ...recordToUpdate } });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}
