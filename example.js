var assets = require('asset-cache');
var PORT = 9000;
assets.listen(PORT, function() {
  console.log('\tAsset server listening on port', PORT);
});
