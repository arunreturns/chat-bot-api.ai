var Express = require('express');

var App = new Express();
        
var port = process.env.PORT || 8080; 

require('./server/configServer.js')(App);

require('./server/databaseConfig.js')(App);

App.use(Express.static(__dirname + '/public'));
App.set("appName", "file-storer.herokuapp.com");

require('./server/expressRoutes.js')(App);

App.listen(port, function() { 
    console.log('Listening on port [%d]', port);
});


module.exports = App;