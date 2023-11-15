const fs = require('fs')
const axios = require('axios')
const iconv = require('iconv-lite')

module.exports = {
    getBytes,
    getHtml,
}

/**
 * 二进制请求，并写入文件
 * 用于下载图片
 * 传入图片 url 与本地保存 path
 */
function getBytes(url, path) {
    axios.get(url, { responseType: 'stream' }).then(function (response) {
        response.data.pipe(fs.createWriteStream(path))
    })
}

/**
 * 获取 HTML 设置编码，
 * 返回 HTML 字符串
 */
async function getHtml(url, encoding) {
    let res = await axios({
        url,
        responseType: 'stream', // 以数据流的方式输出
    })

    // 返回一个promise实例对象
    return new Promise((resolve) => {
        const chunks = []
        res.data.on('data', (chunk) => {
            chunks.push(chunk)
        })
        res.data.on('end', () => {
            const buffer = Buffer.concat(chunks)
            // 此处填写网页编码
            const str = iconv.decode(
                buffer,
                encoding === undefined ? 'utf-8' : encoding
            )
            resolve(str)
        })
    })
}
