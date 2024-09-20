
"use strict";

import ANSI from "../../var/ansi.js";

/**
 * Logs basic information about the application on start.
 * 
 * @author David.A super-user-d0
 * @returns {void}
 */
export default function logDetails() {
  const ansi = ANSI();
  const element = [
    {name: "application name", value: process.env["application.name"]},
    {name: "application version", value: process.env["application.version"]},
    {name: "application mode", value: process.env["application.releaseTag"]},
    {name: "server address", value: process.env["listener.address"]},
    {name: "server port", value: process.env["listener.port"]},
  ]
 
  element.forEach(elem => { 
    console.log(
      `${ansi.dim} - ${elem.name}${ansi.reset} \t ${ansi.green}${elem.value}${ansi.reset}`
    );
  });
  return void 0;
}
