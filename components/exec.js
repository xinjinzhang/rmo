let exec = require('child_process').exec;
module.exports = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, { encoding: "utf-8" }, (err, stdout, stderr) => {
            resolve(stdout);
        })
    })
}