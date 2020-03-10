/**
 * 缓存控制
 */

// etag
let etag = require('etag');

/**
 * checkCache
 * @param {*} stats 
 * @param {*} req 
 */
function checkCache(stats, req) {
    // 获取客服端发送的请求的缓存字段(属性名必须小写)
    let ifNoneMatch = req.headers['if-none-match'];
    let ifModifiedSince = req.headers['if-modified-since'];

    // 获取服务器端的缓存字段
    let eTag = etag(stats);
    let lastModified = new Date(stats.mtime).toGMTString();

    // 判断 ifNoneMatch 与服务器的 eTag 是否相等
    if (ifNoneMatch && ifNoneMatch === eTag) {
        return true;
    }

    // 判断 ifModifiedSince 与服务器的 lastModified 是否相等
    if (ifModifiedSince && ifModifiedSince === lastModified) {
        return true;
    }

    return false;
}

/**
 * setCache 设置缓存
 * @param {*} stats 
 * @param {*} res 
 */
function setCache(stats, res) {
    // 设置强制缓存
    res.setHeader('Cache-Control', 'max-age=3600,public');
    res.setHeader('Expires', new Date(Date.now() + 3600).toGMTString());

    // 设置协商缓存
    res.setHeader('Etag', etag(stats));
    res.setHeader('Last-modified', new Date(stats.mtime).toGMTString());

}

/**
 * cache 判断处理缓存函数
 * @param {*} stats 
 * @param {*} req 
 * @param {*} res 
 */

function cache(stats, req, res) {
    // 判断是否命中缓存
    let isCache = checkCache(stats, req);

    // 如果命中
    if (isCache) {
        res.statusCode = 304;
        res.end();
        return true;
    }

    // 如果没有命中则设置缓存:
    // 第一次请求/没有设置缓存
    setCache(stats, res);
    return false;
}


module.exports = cache;