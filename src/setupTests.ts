import "@testing-library/jest-dom";

if (typeof global.TextEncoder === "undefined") {
  const util = await import("util");
  global.TextEncoder = util.TextEncoder as typeof global.TextEncoder;
  global.TextDecoder = util.TextDecoder as typeof global.TextDecoder;
}
