let path = require('path');
let fs = require('fs');
let exec = require('./exec.js');
module.exports = async function (extractDirPath, objectiveNamesArray = [], objectiveFileNames) {
    let result = await extractDirPath;
    let fileNames = [];
    if (objectiveFileNames) {
        let contentText = fs.readFileSync(objectiveFileNames, 'utf-8');
        contentText = contentText.trim().split('\n').filter(row => row.length).map(row => fileNames.push(row))
    }
    objectiveNamesArray.map(item => fileNames.push(item));
    fileNames.map(async filename => {
        await exec(`rm ${result.dirPath}/${filename}`);
    });
    return result;
}