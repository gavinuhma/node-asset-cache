var server = require('./lib/asset-cache');
var PORT = 9000;
server.listen(PORT, function() {
  console.log('\tAsset server listening on port', PORT);
});
