
"use strict";

class server_metrics_g {
  constructor () {
      this.views = {
        NOT_FOUND: {
          req: 0,
          path_cursor: 0, // the position/cursor of the path to be replaced after reaching
          // its limits. 
          paths: [] // the current 0-10 paths based on the amount of requests.
          // cannot exceed 10 elements. this together with the path_cursor uses the FIFO DSA
          // once its limit(10) is reached.
        },
        OK: {
           /*path: {
             req_gz: amount,
             req_br: amount,
             req: amount,
             bestResponseTimes: time_in_ns,
             worsteResponseTime: time_in_ns
           }
           */
        },  // miss
        NOT_MODIFIED: 0, //hits
        INTERNAL_SERVER_ERROR: 0
      };
      this.viewsCache = {
        paths: [],
        memory: 0
      }
  }
  /**
   * A function that updates the view section of the cache.
   * 
   * @param {string} status - The request status: values can only be : `OK`, `NOT_FOUND`
   * `NOT_MODIFIED`, `INTERNAL_SERVER_ERROR`.
   * @param {string | array} n - A namespace identifier. this param is only needed if the first 
   * param was set to `OK` or `NOT_FOUND`. for `OK`, the value of n should be an array
   * of 3 elements where the first one is the internal url path, the second is the 
   * compression algoithm beign used and the 3rd is the **RESPONSE TIME** in nanoseconds, 
   * and for `NOT_FOUND` the value should be the path
   * of the request (url).
   * @returns {void} 
   */
  upadeStatic(status, n) {
    let resource = this.views[status];
    if (status === "OK") {
      if (!resource[n[0]]) this.views.OK[n[0]] = {
          req_gz: 0,
          req_br: 0,
          req: 0,
          bestResponseTimes: undefined,
          worsteResponseTime: undefined
      }
      resource = resource[n[0]]; // where n[0] is the url path.
      if (n[1] === "gzip") {
        resource.req_gz =
           resource.req_gz === undefined ? 1 : resource.req_gz + 1
      } else if (n[1] === "br") {
        resource.req_br =
           resource.req_br === undefined ? 1 : resource.req_br + 1
      } else {
        resource.req =
           resource.req === undefined ? 1 : resource.req + 1
      }
      // where n[1] is the algorithm used.
      resource.bestResponseTimes = resource.bestResponseTimes ? (
        n[2] < resource.bestResponseTimes ? n[2] : resource.bestResponseTimes
      ) : n[2];
      resource.worsteResponseTime = resource.worsteResponseTime ? (
        n[2] > resource.worsteResponseTime ? n[2] : resource.worsteResponseTime
      ) : n[2] + BigInt(1); //add a single nanosecond.
      // where n[3] is the response time.
    } else if (status === "NOT_FOUND") {
      this.views.NOT_FOUND.req = resource.req + 1;
      if (!resource.paths.includes(n)) {
        if (resource.paths.length < 10) this.views.NOT_FOUND.paths.push(n)
        else {
          this.views.NOT_FOUND.paths[resource.path_cursor] = n;
          if (resource.path_cursor === 9) this.views.NOT_FOUND.path_cursor = 0;
          else this.views.NOT_FOUND.path_cursor += 1;
        }
      }
    } else this.views[status] = resource + 1
    return void 0;
  }
  /** Returns the view section of the cache.  */
  getStatic() {
    return this.views;
  }

  /** 
   * Update the view section of the cache (the section storing metrics about the current
   * static content cache). 
   *  
   * @param {object} newCache - format : 
   * ```
   * {
   *    paths: [],
   *    memory: 0
   * }```
   * @returns {true}
  */
  setStaticCache(newCache) {
    this.viewsCache = newCache;
    return true;
  }
  /** get the view section of the cache (the section storing metrics about the current
   * static content cache).  */
  getStaticCache() {
    return this.viewsCache;
  }

  static server_metrics() {
      if (!server_metrics_g.instance) {
          server_metrics_g.instance = new server_metrics_g();
      }
      return server_metrics_g.instance;
  }
}

/**
 * A global cache that stores and updates information about the server.
 * some of this cache available methods incl : `upadeStatic`, `getStatic`, `getStaticCache`
 * ,`setStaticCache` etc.
 */
const server_metrics = () => server_metrics_g.server_metrics();

export default server_metrics;
