
import server from "su-chronos";
import db1 from "./src/etc/db.conf.js";
import root from "./src/interface/root.js";

const application = new server(root);

application.build();

await db1(process.env.DBKEY).connect();

application.startServer();
