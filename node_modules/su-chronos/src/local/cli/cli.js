
"use strict";

import * as readLine from "node:readline";
import ANSI from "../../var/ansi.js";
import handleCommand from "./handleCommand.js";
import { stdin as input, stdout as output } from "node:process";

/** The cli interface. this function starts and handles the chronos command line 
 * interface.
 * 
 * @param {string} url - The server's url.
 */
export default function cli(url) {
    const ansi = ANSI();
    const serverInfo = [
        process.env["application.name"],
        process.env["application.version"],
    ]
    const prompt = 
`${ansi.dim}┌─(${ansi.reset}${ansi.green}${serverInfo[0]}@${serverInfo[1]}${ansi.reset}${ansi.dim})-[${ansi.reset}${ansi.boldDim}${url}${ansi.reset}${ansi.dim}]${ansi.reset}
${ansi.dim}└─${ansi.reset}${ansi.green}\$${ansi.reset} `;
    
    const rl = readLine.createInterface({ input, output });  
    rl.setPrompt(prompt);
    rl.prompt();
    
    rl.on("line", (command) => {
       handleCommand(command);
       rl.prompt();
    });
}
