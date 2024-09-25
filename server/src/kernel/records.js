import db from "../etc/db.conf.js";
import { ObjectId } from "mongodb";

export async function write(request, response) {
  try {
    await db().target("records").insertOne({ ...request.body, votes: 0 });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function read(request, response) {
  try {
    const size = Number(request.query.size) || 15;
    const page = Number(request.query.page) * size || 0;
    const projection = {};
    if (request.query.limited) {
      projection.name = 1;
      projection.x = 1;
      projection.tg = 1;
      projection.chains = 1;
      projection.currentCalls = 1;
      projection.votes = 1;
      projection.image = 1;
      projection.date = 1;
    }
    const data = await db().target("records").find({}, { projection })
      .skip(page).limit(size).sort({ date: -1 }).toArray();
    response.status(200).json({ ack: true, data });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function readOne(request, response) {
  try {
    const data = await db().target("records").findOne({ _id: new ObjectId(request.query.id) });
    if (data) {
      response.status(200).json({ ack: true, data });
    } else {
      response.status(404).json({ ack: false });
    }
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function writeComment(request, response) {
  try {
    await db().target("records").updateOne({ _id: new ObjectId(request.query.id) }, {
      $push: { comments: request.body }
    });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}


export async function writeCalls(request, response) {
  try {
    await db().target("records").updateOne({ _id: new ObjectId(request.query.id) }, {
      $push: { calls: request.body }
    });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function deleteRecord(request, response) {
  try {
    await db().target("records").deleteOne({ _id: new ObjectId(request.query.id) });
    response.status(200).json({ ack: true });
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
    if (body.chains) recordToUpdate.chains = body.chains;
    if (body.currentCalls) recordToUpdate.currentCalls = body.currentCalls;
    if (body.image) recordToUpdate.image = body.image;
    if (body.calls) recordToUpdate.calls = body.calls;

    await db().target("records").updateOne({ _id: new ObjectId(request.query.id) }, { $set: { ...recordToUpdate } });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}

export async function vote(request, response) {
  try {
    await db().target("records").updateOne({ _id: new ObjectId(request.query.id) }, { $inc: { votes: Number(request.query.count) ?? 1 } });
    response.status(200).json({ ack: true });
  } catch (error) {
    response.status(500).json({ ack: false, message: error.message });
  }
}
