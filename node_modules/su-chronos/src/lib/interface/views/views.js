
"use strict";

import allowedExtensionsForCompression from
  "../../../global/allowedExtensionsForCompression.js";
import { hrtime } from "node:process";
import { join } from "node:path";
import mimeTypeOf from "./genMimetype.js";
import { readFile } from "node:fs/promises";
import server_metrics from "../../../global/server.metrics.js";
import static_cache from "../../../global/static.cache.js";
import static_log from "../../../global/static.log.js";
import { URL } from "node:url";
import { _404 } from "./templates.js";

/**
 * The handler that serves static files upon request.
 * 
 * @author David.A super-user-d0
 * @param {object} request - The request object recieved from the http server. 
 * @param {object} response - The response object recieved from the http server. 
 */

export default async function viewInterface(request, response) {
  let url = new URL(`http://${process.env["listener.address"]}${request.url}`).pathname;
  const requestEtag = request.headers["if-none-match"];
  const rewriteToEntry = process.env["view.rewriteToEntry"] === "true" ? true : false;
  const usesCacheBusting = process.env["view.usesCacheBusting"] === "true" ? true : false;

  if (url === "/") url = "/index.html";
  url = decodeURIComponent(url).slice(1);
  // An internal version of the request url. useful after internal path re-writing.
  let internal_url = url; 

  let resource = static_log().find(url); 
  // if resource not found, rewrite to index.html if "view.rewriteToEntry" is set to
  // "true", else see the "else" block below.
  if (resource === undefined && rewriteToEntry) {
    resource = static_log().find("index.html");
    internal_url = "index.html";
  }

  // determine compression algorithm
  let acceptedEncoding = request.headers["accept-encoding"];
  acceptedEncoding = acceptedEncoding ? acceptedEncoding.split(",").map(elem => {
      return elem.trim()
    }) : "";
  if (acceptedEncoding !== "") {
     for (let i = 0; i < acceptedEncoding.length; i++) {
       if (acceptedEncoding[i] === "gzip" || acceptedEncoding[i] === "br") {
         acceptedEncoding = acceptedEncoding[i];
           break;
       } else
         if (i === (acceptedEncoding.length - 1)) acceptedEncoding = "";
      }
  }

  const data = async () => {
       const isCompressed = allowedExtensionsForCompression(internal_url);
       let content = static_cache().find(internal_url, acceptedEncoding);
       if (content === undefined) {
            let cwd = process.cwd();
            let path;
            if (isCompressed && acceptedEncoding !== "") {
              cwd = join(cwd, ".chronos", "static");
              acceptedEncoding === "gzip" ? path = join(cwd, internal_url + ".gz")
                : path = join(cwd, internal_url + ".br")
            } else path = join(cwd, "src", "views", internal_url)
            content = await readFile(path);
        } 
        return content;
  }

  if (resource !== undefined) { 
    if (requestEtag === resource.etag) {
      response.statusCode = 304; //not modified
      server_metrics().upadeStatic("NOT_MODIFIED");
      response.end(); 
    } else {
      // process the fresh resource 
      const startTime = hrtime.bigint();
      data().then(content => {
        response.statusCode = 200;
        response.setHeader(
          "Content-Type",
          `${mimeTypeOf(internal_url)}${allowedExtensionsForCompression(internal_url) ? ";charset=UTF-8" : ""}`
        );
        if (acceptedEncoding !== "" && allowedExtensionsForCompression(internal_url)) {
          response.setHeader("Content-Encoding", acceptedEncoding);
        } 
        // update client side caching headers.
        if (internal_url === "index.html" || !usesCacheBusting) {
           response.setHeader("Pragma", "no-cache");
           response.setHeader(
              "Cache-Control",
              "max-age=86400, s-maxage=86400, public, must-revalidate, proxy-revalidate, no-cache, no-transform"
           ); 
          response.setHeader("Etag", resource.etag);
        } else response.setHeader("Cache-Control", "public, max-age=31536000, s-maxage=31536000, no-transform"); // cache for apprxm 1yr.
        const endTime = hrtime.bigint();
        server_metrics().upadeStatic("OK", [
          internal_url, acceptedEncoding, (endTime - startTime)
        ]);
        request.method !== "HEAD" ? response.end(content) : response.end();
      }).catch(() => {
        response.statusCode = 500;
        server_metrics().upadeStatic("INTERNAL_SERVER_ERROR");
        response.end();
      });
    }
  } else {
    server_metrics().upadeStatic("NOT_FOUND", url);
    response.statusCode = 404;
    response.setHeader("Cache-Control", "private, max-age=0, no-store, s-maxage=0");
    response.setHeader("Content-Type", "text/html;charset=UTF-8");
    response.setHeader("Pragma", "no-cache");

    internal_url = "404.html";
    resource = static_log().find(internal_url);
    if (resource === undefined) {
      // end with default.
      response.setHeader("Content-Language", "en-US");
      request.method !== "HEAD" ? response.end(_404(url)) : response.end();
    }
    else {
      // end with 404 file.
      data().then(content => {
        if (acceptedEncoding !== "") {
          response.setHeader("Content-Type", "text/html");
          response.setHeader("Content-Encoding", acceptedEncoding);
        }
        request.method !== "HEAD" ? response.end(content) : response.end();
      }).catch(() => {
        response.statusCode = 500;
        server_metrics().upadeStatic("INTERNAL_SERVER_ERROR");
        response.end();
      });
    }
  }
}
