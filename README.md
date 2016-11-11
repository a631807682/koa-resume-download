koa-resume-download
==================
koa断点续传服务,未添加测试代码


使用方法
------------------
>npm install https://github.com/a631807682/koa-resume-download.git

示例代码
------------------
```
const koa = require('koa'),
    path = require('path'),
    Download = require('koa-resume-download').Download;

let app = koa();

app.use(function*(next) {
    let filePath = path.join(__dirname, './data/mysql.zip');

	//自定义头
    let opts = {
        headers: {
            'Content-disposition': 'attachment; filename=mysql.zip'
        }
    };
	
    let download = new Download(this, opts);

    yield download.start(filePath);
});

app.listen(8000);
console.log('listening 8000...');

```