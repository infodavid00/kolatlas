
"use strict";

import allowedExtensionsForCompression from 
  "../../global/allowedExtensionsForCompression.js";
import ANSI from "../../var/ansi.js";
import { compressSync } from "../../utils/compress.js";
import { 
   existsSync, 
   mkdirSync, 
   readdirSync, 
   readFileSync, 
   rmSync,
   statSync , 
   writeFileSync
} from "node:fs";
import generateEtag from "../../utils/generateEtag.js";
import { join as path_join, sep } from "node:path";
import static_log from "../../global/static.log.js";
import { SYSTEM } from "../../var/system.js";

/**
 * A function specific to the start function that compresses static files synchronously, and 
 * handles versioning using entity tags.
 * Entity tags are only generated for files that where modified, same goes for compression.
 * 
 * @author David.A super-user-d0
 * @returns {void}
 */
export default function handleCompression() {
  console.log("\ncompressing static files (from src/views)");
  const ansi = ANSI();
  const fileParentPath = path_join("src", "views");
  const cachedParentPath = path_join(...SYSTEM.compressedStaticContentsPath);
  let totalFound = 0;
  let totalCompressed = 0;
  let totalEtagModified = 0;

  if (existsSync(fileParentPath)) {
    if (!existsSync(cachedParentPath)) 
      mkdirSync(cachedParentPath, { recursive: true });

    const cachePath = path_join(process.cwd(), ...SYSTEM.staticLogPath);
    let cache =  existsSync(cachePath) ? JSON.parse(readFileSync(cachePath)) : {};

    // recursively look for files in every directory in the src/view dir one after the 
    // other, and compresses every file found with the below format..
    function compressFileRecursively(name) {
      let path = path_join(fileParentPath, name);
      const statics = statSync(path);
      if(statics.isFile()) {
        totalFound += 1;
        const source = path_join(fileParentPath, name); 
        const dest = path_join(cachedParentPath, name);
        let destDir = dest.split(sep);
        destDir.pop();
        destDir = destDir.join(sep);

        const etagChanged = cache[name]?.lm !== statics.mtimeMs;
        if (etagChanged) totalEtagModified += 1;
        cache[name] = {
          etag: etagChanged ? 
            generateEtag(name, cache[name]?.lm) : cache[name]?.etag,
          lm: statics.mtimeMs,
          shouldKeep: true,
          compressedPath: dest
        };
        if (allowedExtensionsForCompression(source)) {
          // ensure parent directories not containing pure text-based static files
          // are not created.
          if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
          // only compress the file if it was modified
          if (etagChanged) {
            totalCompressed = totalCompressed + 1;
            compressSync(source, dest, "gzip, brotli", true);
          } 
        }
      } else {
        const staticFiles = readdirSync(path);
        staticFiles.forEach(e => {
            compressFileRecursively(path_join(name, e));
        })
      }
      return void 0;
    }

    const staticFiles = readdirSync(fileParentPath);
    staticFiles.forEach(elem => compressFileRecursively(elem));

    const filesToDelete = [];
    /* remove any file that doesnt have the shouldKeep === true property as they typically
      do not exists anymore.
    */
    Object.keys(cache).map(e => {
      const elem = cache[e];
      if (elem?.shouldKeep !== true) {
        // push the compressed file path to the `filesToDelete` array
        filesToDelete.push(cache[e].compressedPath);
        cache[e] = undefined;
      } else cache[e].shouldKeep = undefined;
    })
    /* parse the file to json and then back to object to ensure any field with undefined
       as value is removed.
       this ensures the shouldKeep field is removed from the object, as well as objects
       without shouldKeep property.
    */
    cache = JSON.stringify(cache);
    cache = JSON.parse(cache);

    // delete compressed files that are not in the cache but are still present in the fs.
    filesToDelete.forEach(elem => {
      const paths = [elem + ".br", elem + ".gz"];
      if (existsSync(paths[0])) rmSync(paths[0]); //remove the brotli version
      if (existsSync(paths[1])) rmSync(paths[1]); //remove the gzip version
    });

    writeFileSync(cachePath, JSON.stringify(cache, null, 3));
    static_log(cache);

    console.log(` ${ansi.dim}(${totalFound} found) ${ansi.reset}\n`);

    process.stdout.write(`${ansi.boldDim}compressed ${totalCompressed} `);
    process.stdout.write(`file${totalCompressed !== 1 ? "s" : ""} ${ansi.reset}\n`);
    
    process.stdout.write(`${ansi.boldDim}modified ${totalEtagModified} `);
    process.stdout.write(`etag${totalEtagModified !== 1 ? "s" : ""} ${ansi.reset}\n`);

  } else console.log(`\n${ansi.dim} no static file found${ansi.reset}`);
  return void 0;
}
