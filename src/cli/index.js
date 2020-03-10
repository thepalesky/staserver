/* 
  npm i yargs

  配置命令行指令
*/

// yargs
let yargs = require('yargs');

let argv = yargs
    .usage('server [options]')
    .option('p', {
        alias: 'port', // 配置别名 port
        describe: '配置端口号', //描述
        default: '8080', // 默认值
    })
    .option('h', {
        alias: 'host',
        describe: '主机/域名',
        default: 'localhost'
    })
    .option('r', {
        alias: 'root',
        describe: '程序运行根的目录',
        default: process.cwd()
    })
    .version() // 添加查看版本号指令 -v
    .alias('v', 'version') //  --version 配置查看版本号别名
    .help().argv; // --help 查看帮助指令


module.exports = argv;