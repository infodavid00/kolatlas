
import server from "su-chronos";
import db from "./src/etc/db.conf.js";
import root from "./src/interface/root.js";

const application = new server(root);

application.build();

await db(process.env.DBKEY).connect();

application.startServer();
