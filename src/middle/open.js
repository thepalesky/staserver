/**
 * export
 */

// child_process
let { exec } = require('child_process');

module.exports = (url) => {
    let cmd = '';
    // 判断操作系统
    switch (process.platform) {
        case 'win32':
            cmd = 'start';
            break;
        case 'linux':
            cmd = 'xdg-open';
            break;
        case 'darwin': //mac
            cmd = 'open';
            break;
    }
    // 在子线程中打开浏览器命令
    exec(`${cmd} ${url}`);
}