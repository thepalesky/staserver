/**
 * 静态资源服务器
 */

//  加载模块
// http
let http = require("http");
// chalk
let chalk = require("chalk");
// 默认config
let defaultConfig = require("./config");
// cli 脚本指令
let argv = require("./cli");
// 脚本指令运行后的config
let config = Object.assign({}, defaultConfig, argv);
let { port, host, root } = config;
// middle
let middle = require("./middle");
// export
let open = require("./middle/open");

// 开启服务器 创建一个服务
let server = http.createServer(middle(root));
// 开启服务
server.listen(port, host, err => {
    // 优先处理错误机制
    if (err) {
        console.log(chalk.red(`服务器开启失败：${err}`));
        return;
    }
    // 返回访问的服务器地址
    let address = `http://${host}:${port}`;
    console.log(`服务器启动成功,请手动访问：${chalk.blue(address)}`);
    // 服务器启动成功,打开浏览器
    open(address);
});