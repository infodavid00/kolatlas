
"use strict";

import allowedExtensionsForCompression from 
  "../../global/allowedExtensionsForCompression.js";
import { Buffer } from "node:buffer";
import { freemem } from "node:os";
import hmr from "../../utils/hmr.js";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import static_cache from "../../global/static.cache.js";
import server_metrics from "../../global/server.metrics.js";


export default function jobs_update_cache() {
  setInterval(() => {
    const cwd = process.cwd();
    const cacheMaxMem = (Number(process.env["view.cacheMaxMem"]) * freemem()) / 100;
    const target = server_metrics().getStatic().OK;
    const buffer = [];
 
    Object.keys(target).forEach((e) => {
      buffer.push([e+"..CHRONOSJOIN.."+"gz", target[e].req_gz])
      buffer.push([e+"..CHRONOSJOIN.."+"br", target[e].req_br])
      buffer.push([e+"..CHRONOSJOIN.."+"", target[e].req])     
    });

    let bufferSorted = [];
    let bufferCloned = buffer;

    for (let i = 0; i < buffer.length; i++) {
      let rankCursor = []; // score, index
      bufferCloned.forEach((elem, index) => { 
        if (elem[1] !== 0 && elem[1] > (rankCursor[0] ?? 0)) 
          rankCursor = [elem[1], index];
      });
      if (rankCursor[1] !== undefined) 
         bufferSorted.push(bufferCloned[rankCursor[1]]);
      bufferCloned = bufferCloned.filter((elem, i) => i !== rankCursor[1]);
    }

    const newTable = {};
    bufferSorted = bufferSorted.map(elem => { return elem[0].split("..CHRONOSJOIN..")});
    bufferSorted.forEach(async (elem, index) => {
      let path;
      if ((elem[1] === "gz" || elem[1] === "br") &&
         allowedExtensionsForCompression(elem[0]) === false) elem[1] = ""

      if (elem[1] === "gz" || elem[1] === "br") 
         path = join(cwd, ".chronos", "static", elem[0] + "." + elem[1])
      else path = join(cwd, "src", "views", elem[0])

      try {
        const content = await readFile(path);
        let tableLen = Object.keys(newTable).map(e => Buffer.byteLength(newTable[e]));
        tableLen = tableLen.reduce((accum, elem) => accum + elem, 0);
        
        let netTableLen = tableLen + Buffer.byteLength(content);
        if (netTableLen <=  cacheMaxMem) {
            newTable[elem[0] + "." + (elem[1] === "gz" ? "gzip" : elem[1])] = content;
        }
        if (index === bufferSorted.length - 1) {
          static_cache().replace(newTable);
          server_metrics().setStaticCache({
            paths: Object.keys(newTable).map(elem => {
              if (elem.endsWith(".gzip")) elem = [elem.slice(0, elem.length - 5), "gzip"]
              else if (elem.endsWith(".br"))
                   elem = [elem.slice(0, elem.length - 3), "brotli"]
              else elem = [elem.slice(0, elem.length - 1), "plain"]
              return elem;
            }),
            memory: hmr(netTableLen)
          });
        }
      } catch {
        return void 0; //silently drop error
      }
    });

  }, Number(process.env["view.updateCacheAfter"]) * 1000);
};

