/**
 * middle 中间处理函数
 */

// path
let path = require("path");
// fs
let fs = require("fs");
// pug
let pug = require("pug");
// extname
let getFileType = require("../extname/index");
// compress
let compress = require("../compress/index");
// cache
let cache = require("./cache");

// {promisify} 解构赋值
let { promisify } = require("util");

let stat = promisify(fs.stat);
let readdir = promisify(fs.readdir);
// let readFile = promisify(fs.readFile);

// 异步函数
module.exports = root => {
    return async(req, res) => {
        // 获取请求的路径(请求对象中的URL属性)
        let url = req.url;
        // 组成绝对路劲 {.}非常重要,避免路径强制为根目录
        let filePath = path.resolve(root, `.${url}`);
        try {
            // 获取stats
            let stats = await stat(filePath);
            // 文件是存在的,开始判断
            // 是否是文件夹
            if (stats.isDirectory()) {
                // 返回文件夹下所有的目录
                // fs.readdir 读取文件夹下的目录,返回一个files对象
                let files = await readdir(filePath);

                // pug 模板引擎渲染
                let pugPath = path.resolve(__dirname, "../pug/index.pug");
                // G:\1109.mine.课件\20.03.06\server\模板引擎\src\middle
                // console.log(__dirname); //当前文件所在的文件夹路径
                let html = pug.renderFile(pugPath, { files, url });

                // 成功读取
                res.statusCode = 200;
                res.setHeader("Content-Type", `text/html;charset=utf8`);
                res.end(html);
                // 退出fs.stat到http.createServer中(不需要在执行下面的判断是否是文件了,所以直接退出,优化性能)
                return;
            }

            // 是否是文件
            if (stats.isFile()) {
                // 返回文件所有的内容
                // fs.readFile 读取文件内容,返回一个data对象
                // let data = await readFile(filePath);
                // 使用文件流,方便进行压缩处理
                let rs = fs.createReadStream(filePath);

                // 缓存优化
                // 调用缓存函数
                let isCache = cache(stats, req, res);

                // 如果返回值为true,则表明已有缓存
                if (isCache) {
                    // 直接退出,无需服务器再次返回响应
                    return;
                }
                // 如果返回值是false,缓存函数里已经设置了缓存相关参数,与下面设置一起返回响应,下次请求即可走缓存

                // 成功读取
                let type = getFileType(filePath);

                if (type.match(/(javascript|css|html|txt|json)/)) {
                    // 压缩
                    rs = compress(rs, req, res);
                }

                res.statusCode = 200;
                res.setHeader("Content-Type", `${type};charset=utf8`);
                rs.pipe(res);
                // res.end(data);

                // 这样写会导致图片内容加载不出来
                // res.end(`${data}`);

                // 退出fs.stat到http.createServer中(最后一个判断实际可以省略)
                return;
            }
        } catch (err) {
            console.log(err);
            // 一进来就报错,服务器中找不到文件路径
            // 设置配置属性(响应给浏览器)
            // 响应状态码
            res.statusCode = 404;
            // 响应报文头部解析格式类型
            res.setHeader("Content-Type", "text/html;charset=utf8");
            // 响应报文体
            res.end(`${url}不是一个文件或文件夹`);
        }
    };
};
