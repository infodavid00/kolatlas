
"use strict";

import allowedExtensionsForCompression from "./allowedExtensionsForCompression.js";

class static_cache_g {
  constructor() {
    this.table = {};
  }

  insert(path, compressionAlgorithm, content) {
      this.table[path + "." + compressionAlgorithm] = content;
      return true;
  }

  replace(table) {
      this.table = table;
      return true;
  }

  find(path, compressionAlgorithm) {
    return this.table[path + "." + (allowedExtensionsForCompression(path) ? compressionAlgorithm : "")];
  }

  static static_cache() {
    if (!static_cache_g.instance) {
      static_cache_g.instance = new static_cache_g();
    }
    return static_cache_g.instance;
  }
}

/**
 * A function representing a global cache that contains a copy of the content of an original
 * static file. this function caches frequently assesed files and provide methods, for inserting
 * finding and replacing the cache.
 */
const static_cache = () => static_cache_g.static_cache();

export default static_cache;
