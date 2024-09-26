
import { MongoClient, ServerApiVersion } from "mongodb";

class MONGODB {
  constructor(uri) {
    this.uri = uri;
  	this.client = new MongoClient(this.uri, {
  	   serverApi: {
  	   	  version: ServerApiVersion.v1,
  	   	  strict: true,
  	   	  deprecationErrors: true
  	   }, 
  	   maxPoolSize: 4,
  	   minPoolSize: 2
  	});
  }

  async connect() {
    return await this.client.connect();
  }

  target(collection) {
    return this.client.db("kolatlas").collection(collection);
  }

  async close() {
  	return await this.client.close();
  }

  static db(uri) {
  	if (!MONGODB.instance) {
  	  MONGODB.instance = new MONGODB(uri);
  	}
  	return MONGODB.instance;
  }
}

const db = (uri) => MONGODB.db(uri);

export default db;
