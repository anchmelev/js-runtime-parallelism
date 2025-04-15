// cpu-child-worker.js

const { heavyCalc } = require("../heavyCalc.js");

const result = heavyCalc();
console.log(result);
