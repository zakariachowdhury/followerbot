var fs = require("fs");

function log(err, msg) {
    if (err != null) {
        error(err);
    } else {
        console.log(new Date().toString() + ' - ' + msg); 
    }
}

function error(err) {
    console.log(new Date().toString() + ' - Error: ' + err); 
}

function loadConfig() {
    return JSON.parse(fs.readFileSync("config.json"))
}

function getRandomIndex(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

 module.exports = {
   log: log,
   error: error,
   loadConfig: loadConfig,
   getRandomIndex: getRandomIndex
 }
