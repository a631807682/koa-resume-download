const fs = require('fs');

class Download {
    /**
     * @param  {object} ctx   koa上下文
     * @param  {object} opts  {headers:{'something':'abc'}}
     */
    constructor(ctx, opts) {
        opts = opts || {};

        this._req = ctx.request;
        // this._res = ctx.res;
        this._res = ctx.response;
        this._opts = opts;

        if (typeof(opts.headers) === 'object') {
            this._res.set(opts.headers);
        }
    }

    /**
     * 开始下载
     * @param  {string} filePath 
     * @return {promise}          
     */
    start(filePath) {
        let self = this;
        let res = self._res;

        return new Promise(function(resolve, reject) {
            if (fs.existsSync(filePath)) {
                let stat = fs.statSync(filePath);
                let fileSize = stat.size;
                //范围
                let range = self._req.headers.range;
                let startRange = self._getStartRange(range);
                //写入range
                self._setHeaders(startRange, fileSize);
                //file写入body
                self._writeFile(filePath, startRange);

                resolve();
            } else {
                reject('file not found');
            }
        });
    }

    /**
     * 获取范围开始下标
     * @param  {string} range 报头range:(bytes=1024-)
     * @return {number} 
     */
    _getStartRange(range) {
        let startRange = 0;
        if (range != undefined) {
            var startRangeMatch = /^bytes=([0-9]+)-$/.exec(range);
            startRange = Number(startRangeMatch[1]);
        }
        return startRange;
    }

    /**
     * 写入content-range:(bytes 1024-65535/65536)
     * @param  {number} startRange 
     * @param  {number} fileSize 
     */
    _setHeaders(startRange, fileSize) {
        let self = this;
        let res = self._res;
        // 如果startPos为0，表示文件从0开始下载的，否则则表示是断点下载的。
        if (startRange == 0) {
            res.set('content-length', fileSize);
            res.status = 200;
        } else {
            /*
                x-transfer-length 返回文件总大小 用于监控下载进度
                此处无法使用content-length,分包返回时content-length必须是单个包的body大小
             */
            res.set('x-transfer-length', fileSize);
            res.set('Accept-Ranges', 'bytes');
            res.set('Content-Range', 'bytes ' + startRange + '-' + (fileSize - 1) + '/' + fileSize);
            res.status = 206;
        }

    }

    /**
     * 回写文件
     * @param  {string} filePath  
     * @param  {string} startRange 
     * @return {readStream}            
     */
    _writeFile(filePath, startRange) {
        let self = this;
        let res = self._res;

        res.body = fs.createReadStream(filePath, {
            start: startRange
        });
    }

}

module.exports = Download;
