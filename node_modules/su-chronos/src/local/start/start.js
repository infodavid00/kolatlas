
"use strict";

import ANSI from "../../var/ansi.js";
import cli from "../cli/cli.js";
import { createServer } from "node:http"; 
import gateway from "../../lib/gateway.js";
import jobs_update_cache from "../../lib/jobs/jobs.updateCache.js";
import server_options from "../../global/server.options.js";

/**
 * The function that starts the server and any neccessary background job.
 * 
 * @author David.A super-user-d0
 */
export default function start() {
  const ansi = ANSI();
  const address = process.env["listener.address"];
  const port = process.env["listener.port"];

  const server = createServer(gateway);
  const onServerStart = () => {
    const url = `http://${address}:${port}`;
    console.log();
    jobs_update_cache();
    if (server_options().getInnerOptions().enableCLI) cli(url)
    else {
      const reason = process.argv.includes("::disable-cli") ? 
        "the presence of the \`::disable-cli\` command line argument." : 
        "the lack of support for ANSI commands on your terminal.";
      console.log(`${ansi.dim} The Chronos CLI was disabled due to ${reason}${ansi.reset}`);
    }
  };
  const serverParams = [port]
  if (address === "127.0.0.1") serverParams.push(onServerStart)
  else {
    serverParams.push(address);
    serverParams.push(onServerStart);
  }

  server.listen(...serverParams);
}
