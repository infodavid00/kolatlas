
"use strict";

import ANSI from "../var/ansi.js";
import { deflateSync, gzipSync, brotliCompressSync } from "node:zlib";
import hmr from "./hmr.js";
import { join, sep } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

/**
 * A function that compresses a file to its tiniest form synchronously using 
 * the deflate, gzip and brotli algorithm, depending on the specification.
 * 
 * @author David.A super-user-d0
 * @param {string} source - The relative path to the target file to compress.
 * @param {string} dest - The relative path to where the compressed file should 
 * be stored.
 * @param {string} algorithm - The algorithm to be used. possible values includes 
 * brotli, deflate and gzip seperated by commas.
 * @param {boolean} showLog - A boolean that indicates whether logs should be made.
 * @returns {Array} - A multi dimensional array where each child contains three elements 
 * which are the originalSize, compressedSize and algorithm name, respectively.
 */
export function compressSync(source, dest, algorithm, showLog) {
  const ansi = ANSI();
  const fileBuffer = readFileSync(source);
  const originalSize = hmr(Buffer.byteLength(fileBuffer));
  algorithm = algorithm.split(",").map(elem => elem.trim());
  const compression_option = { level: 7 };

  let compressed = [];

  for (let i = 0; i < algorithm.length; i++) {
    const element = algorithm[i];
    if (element === "deflate") {
      const compressedFile = deflateSync(fileBuffer, compression_option);
      writeFileSync(`${dest}.zip`, compressedFile);
      compressed.push([originalSize, hmr(Buffer.byteLength(compressedFile)), "deflate"]);
    }
    if (element === "gzip") {
      const compressedFile = gzipSync(fileBuffer, compression_option);
      writeFileSync(`${dest}.gz`, compressedFile);
      compressed.push([originalSize, hmr(Buffer.byteLength(compressedFile)), "gzip"]);
    }
    if (element === "brotli") {
      const compressedFile = brotliCompressSync(fileBuffer, compression_option);
      writeFileSync(`${dest}.br`, compressedFile);
      compressed.push([originalSize, hmr(Buffer.byteLength(compressedFile)), "brotli"]);
    }
  }
  if (showLog) {
    source = source.split(sep).slice(2)
    source = join(...source)
    process.stdout.write(" ");
    process.stdout.write(`${ansi.green}${source}${ansi.reset}  `);
    process.stdout.write(`${ansi.boldDim}${originalSize}${ansi.reset}`);
    compressed.forEach((elem, index) => {
      process.stdout.write(`${ansi.dim} | `)
      process.stdout.write(`${elem[2]}: ${elem[1]}${ansi.reset} `);
      process.stdout.write(`${index === compressed.length - 1 ? "\n" : ""}`);
    });  
  }
  return compressed;
}
