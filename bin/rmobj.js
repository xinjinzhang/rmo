#!/usr/bin/env node

var currentPath = process.cwd();
var path = require('path');
var spawn = require('child_process').spawn;
var extractArchitecture = require('../components/extractArchitecture.js');
var deleteObjectiveFromDir = require('../components/deleteObjectiveFromDir.js');
var packageItem = require('../components/packageItem.js');
var exec = require('../components/exec.js');
var fs = require('fs');

function outhelp() {
    console.log('usage:\n');
    console.log('-v --version [show version]');
    console.log('rmo libexample.a names --out=path_to_newfile');
    console.log('rmo libexample.a a.o b.o c.o');
    console.log('libexample.a:库文件');
    console.log('names:文本文件列出要删除的.o文件名');
    console.log('out:输出文件,可选没有会覆盖源文件');
}

async function run(argv) {
    if (argv[0] === '-v' || argv[0] === '--version') {
        console.log('version is 1.0.0');
    }
    else if (argv[0] === '-h' || argv[0] === '--help' || argv.length === 0) {
        outhelp();
    } else if (argv[0] && /\.a$/.test(argv[0])) {
        var filePath = argv[0];
        var outputfile;
        var otherParams = argv.slice(1);
        var aParam, objectiveNamesArray = [], objectiveFileNames;
        try {
            await fs.accessSync(`${filePath}.bak`);
        } catch (err) {
            await exec(`cp ${filePath} ${filePath}.bak`);
        }
        do {
            aParam = otherParams.shift();
            if (/^--out\s*=.*$/.test(aParam)) {
                try {
                    console.log("out", aParam.split("=")[1].trim());
                    outputfile = aParam.split("=")[1].trim();
                } catch (err) {
                    throw new Error("--out 参数错误");
                }
                break;
            } else if (/.*\.o$/.test(aParam)) {
                console.log(".o", aParam);
                objectiveNamesArray.push(aParam);
            } else if (aParam && path.parse(aParam)) {
                console.log("path", path.parse(aParam));
                objectiveFileNames = aParam;
            }
        } while (aParam);
        var spawnObj = spawn('lipo', ['-info', filePath], { encoding: 'utf-8' });
        // 捕获标准输出并将其打印到控制台 
        spawnObj.stdout.on('data', async function (chunk) {
            var result = chunk.toString();
            var architectures = result.split('are: ')[1].split(' ').filter(item => item.length && !/[\n]/.test(item));
            console.log('Architectures is', architectures);
            var promiseItems = architectures.map(item => extractArchitecture(item, filePath))
                .map(promiseDirPath => deleteObjectiveFromDir(promiseDirPath, objectiveNamesArray, objectiveFileNames))
                .map(promiseItem => packageItem(promiseItem, filePath));
            let arr = await Promise.all(promiseItems);
            let items = arr.map(item => `${item.dirname}.a`).join(' ');
            console.log(items);
            await exec(`lipo -create ${items} -output ${outputfile || filePath}`);
            await exec(`rm -rf ${path.parse(filePath).name}_*`);
        });
        spawnObj.stderr.on('data', (data) => {
            console.log(data.toString());
        });
        spawnObj.on('close', function (code) {
            console.log('close code : ' + code);
        });
        spawnObj.on('exit', function (code, signal) {
            console.log('child process exit:' + code);
        });
    } else {
        outhelp();
    }
    // else if (argv[0] === '-s' || argv[0] === '--start') {
    //     var app = new express();
    //     app.use('/static', express.static(path));
    //     app.listen(8085, function () {
    //         console.log('server start at port 8085');
    //     });
    // }
}

run(process.argv.slice(2));