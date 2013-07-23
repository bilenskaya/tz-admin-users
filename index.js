
var app = require('./app/main');
var port = Number(process.argv.slice(2)[0]) || 8080;


app.listen(port);
console.log('Start server on port: ' + port);