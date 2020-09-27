let path = require('path');
let fs = require('fs');
let exec = require('./exec.js');
module.exports = async function (promiseItem, filePath) {
    let result = await promiseItem;
    let pathObj = path.parse(filePath);
    let dirname = `${pathObj.name}_${result.item}`;
    await exec(`ar rcs ${dirname}.a ${result.dirPath}/*.o`);
    return result;
}