const koa = require('koa'),
    path = require('path'),
    Download = require('../index').Download;

let app = koa();

app.use(function*(next) {
    let filePath = path.join(__dirname, './data/mysql.zip');

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
