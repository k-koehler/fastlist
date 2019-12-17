console.log("for (const .. of ..) iteration:");
require("./iterate/run-bench");
console.log("iterable.forEach iteration:");
require("./for-each/run-bench");
console.log("iterable random access:");
require("./random-access/run-bench");
