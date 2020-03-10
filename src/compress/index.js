/**
 *
 * compress
 * 压缩处理
 */

//  zlib 压缩模块
let { createGzip, createDeflate } = require("zlib");

function compress(rs, req, res) {
    // 获取响应报文头部 浏览器支持压缩格式字段
    let acceptEncoding = req.headers["accept-encoding"];
    // 判断是否存在该字段
    if (acceptEncoding) {
        // 获取支持压缩格式的数组
        let acceptEncodingArr = acceptEncoding.split(", ");
        // 继续判断支持哪种压缩格式
        // 在支持的格式里有gzip格式
        if (acceptEncodingArr.indexOf("gzip") !== -1) {
            // 设置响应头部压缩字段
            res.setHeader("Content-Encoding", "gzip");
            // 把文件流rs传入压缩方法里再返回一个rs
            return rs.pipe(createGzip());
        }

        // 在支持的格式里有deflate格式
        if (acceptEncodingArr.indexOf("deflate") !== -1) {
            // 设置响应头部压缩字段
            res.setHeader("Content-Encoding", "deflate");
            // 把文件流rs传入压缩方法里再返回一个rs
            return rs.pipe(createDeflate());
        }
    }
    // 即使浏览器不支持压缩,依然要放回原文件流(否则可能报错)
    return rs;
}

module.exports = compress;