/**
 * 
 * 文件后缀名处理函数 
 */

let path = require('path');

let fileType = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    txt: "text/plain",
    json: "application/json",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    icon: "image/x-icon",
    svg: "image/svg+xml",
    mp3: "audio/mp3",
    mp4: "video/mp4"
}

/**
 * 
 * @param {String} filePath
 * @return {String} flieType
 * 
 */
function getFileType(filePath) {

    let extname = path.extname(filePath).slice(1);
    return fileType[extname];
}
/*  
  // 获取文件类型(其他方法实现)
    let index = filePath.lastIndexOf('.');
    let type = filePath.substring(index + 1, filePath.length);
*/

module.exports = getFileType;