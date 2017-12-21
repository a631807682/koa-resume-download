const koa = require('koa'),
    path = require('path'),
    Download = require('../index').Download;

let app = koa();

app.use(function*(next) {
    let filePath = path.join(__dirname, './data/mysql.zip');

    let opts = {
        headers: {
            'token': '1f0b8af0e60311e786d0d5c0d763be5f'
        }
    };

    let download = new Download(this, opts);

    yield download.start(filePath);
});

app.listen(8000);
console.log('listening 8000...');
