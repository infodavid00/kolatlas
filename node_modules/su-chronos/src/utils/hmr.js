
"use strict";

/**
 * A function From the (gce) service package API that converts the given number of 
 * bytes to a more human readable format.
 * 
 * @author David.A super-user-d0
 * @param {string} bytes - The number of bytes to convert.
 * @returns {string} The human readble format.
 */

export default function hmr(bytes) {
  bytes = Number(bytes);
  const byteThresold = 1024; 
  if (bytes < byteThresold) return `${bytes}B`;
  else if (bytes < Math.pow(byteThresold, 2)) 
    return `${(bytes / Math.pow(byteThresold, 1)).toFixed(2)} KB`;
  else if (bytes < Math.pow(byteThresold, 3))
    return `${(bytes / Math.pow(byteThresold, 2)).toFixed(2)} MB`;
  else if (bytes < Math.pow(byteThresold, 4))
    return `${(bytes / Math.pow(byteThresold, 3)).toFixed(2)} GB`;
  else if (bytes < Math.pow(byteThresold, 5))
    return `${(bytes / Math.pow(byteThresold, 4)).toFixed(2)} TB`;
  else return "out of range";
}
