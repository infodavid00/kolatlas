
"use strict";

export const SYSTEM = {
   compressedStaticContentsPath: [".chronos", "static"],
   encoding: "utf-8",
   staticLogPath: [".chronos", ".st"],
   supportsAnsiCodes: ()=>  process.env["TERMINAL.SUPPORTSANSI"] === "true" ? true : false,
   version: "1.0.0"
}
