
let path = require('path');
let makeDir = require('make-dir');
let exec = require('./exec.js');
module.exports = async function (item, filePath) {
    let pathObj = path.parse(filePath);
    console.log('extract:', item, pathObj.base);
    let dirname = `${pathObj.name}_${item}`;
    let dirPath = await makeDir(dirname);
    await exec(`lipo ${filePath} -thin ${item} -output ${dirPath}/${pathObj.base}`);
    await exec(`cd ${dirPath} && ar xv ${pathObj.base} && rm ${pathObj.base}`);
    return { dirPath, item, pathObj, dirname };
}