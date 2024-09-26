
import db from "../etc/db.conf.js";
import { ObjectId } from "mongodb";

export async function write(request, response) {
  try {
    const result = await db().target("tokens").insertOne({ ...request.body, activity: [] });
    const newId = result.insertedId;
    const kolId = request.body?.callers?._id;
    if (newId && kolId) {     
       const builder = { _id: String(newId), date: request.body?.callers?.date, name: '' }	
       await db().target("records").updateOne({ _id: new ObjectId(kolId) }, { $push: { currentCalls: builder } })
    }
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function read(request, response) {
  try {
    const size = Number(request.query.size) || 15;
    const page = Number(request.query.page) * size || 0;
    const projection = { activity: 0 };
    const data = await db().target("tokens").find({}, { projection })
      .skip(page).limit(size).sort({ date: -1 }).toArray();
    response.status(200).json({ ack: true, data });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function readNames(request, response) {
  try {
    const data = await db().target("tokens").find({}, { projection: { name: 1} }).toArray();
    response.status(200).json({ ack: true, data });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function deleteRecord(request, response) {
  try {
     // Delete the object in the array of all records where _id: String(id)
    await db().target("records").updateMany(
      {},
      {
         $pull: {
            currentCalls: {
                _id: request.query.id
            }
         }
      }
    ); 
    await db().target("tokens").deleteOne({ _id: new ObjectId(request.query.id) });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function readOne(request, response) {
  try {
    const data = await db().target("tokens").findOne({ _id: new ObjectId(request.query.id) });
    if (data) {
      response.status(200).json({ ack: true, data });
    } else {
      response.status(404).json({ ack: false });
    }
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function editRecord(request, response) {
  try {
    const body = request.body;
    const recordToUpdate = {};

    if (body.name) recordToUpdate.name = body.name;
    if (body.x) recordToUpdate.x = body.x;
    if (body.tg) recordToUpdate.tg = body.tg;
    if (body.chain) recordToUpdate.chain = body.chain;
    if (body.ca) recordToUpdate.ca = body.ca;
    if (body.image) recordToUpdate.image = body.image;
    if (body.chart) recordToUpdate.chart = body.chart;
    if (body.website) recordToUpdate.website = body.website;
    if (body.callers) recordToUpdate.callers = body.callers;
    if (body.activity) recordToUpdate.activity = body.activity;
    
    if (body.callers) {
       const id = new ObjectId(request.query.id);
       const kolId = body.callers?._id;
       
       if (id && kolId) {     
         const newCallers = { _id: String(kolId), date: body.callers?.date, name: '' }
         const newCurrentCallObject = { _id: String(id), date: String(new Date()), name: '' }

         // Update the callers in token
         body.callers = newCallers

         // Delete the object in the array of all records where _id: String(id)
         await db().target("records").updateMany(
           {},
           {
             $pull: {
               currentCalls: {
                 _id: String(id)
               }
             }
           }
         );    
         await db().target("records").updateOne({ _id: new ObjectId(kolId) }, { $push: { currentCalls: newCurrentCallObject } })
       }	
    }
    
    await db().target("tokens").updateOne({ _id: new ObjectId(request.query.id) }, { $set: { ...recordToUpdate } });    
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function writeActivity(request, response) {
  try {
    await db().target("tokens").updateOne({ _id: new ObjectId(request.query.id) }, {
      $push: { activity: request.body }
    });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}
