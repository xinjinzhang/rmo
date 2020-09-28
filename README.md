## 功能
iOS 第三方库冲突的处理

辅助解决iOS编辑链接出现duplicate symbol时对库文件重新打包，选择性删除包内部分冲突的目标文件（*.o）

重新打包前自动对库文件时间备份如libexample.a备份为libexample.a.bak

## 安装与测试
* 安装：`npm install -g .`
* 测试：`node ./bin/rmo.js ./ignoreTest/liblibWeex.a objectives`

##例
从libcoreSupport.a中删除ZipArchive.o
```
rmo libcoreSupport.a ZipArchive.o
```
如果要删除的.o文件过多可以通过文件形式给出，文本文件中一行指定一个.o文件名
```
rmo libcoreSupport.a fileNamesforDelete
```