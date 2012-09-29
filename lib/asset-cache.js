/*
 * A simple file server with caching.
 * Used for local dev environments.
*/

var http = require('http');
var path = require('path');
var fs = require('fs');
var DIR = __dirname;

console.log('\tAsset server using dir', DIR);

var loadFile = function(file, ifNoneMatch, callback) {
  file = DIR + file;
  fs.stat(file, function(err,stat) {
    if (err) return callback(null);
    var thisEtag = '"' + stat.size + '-' + stat.mtime.getTime() + '"';
    if (ifNoneMatch && ifNoneMatch == thisEtag) {
      return callback(null, true, thisEtag);
    }
    fs.readFile(file, function(err, data) {
      callback(err ? null : data, false, thisEtag);
    });
  });
};

module.exports = http.createServer(handleRequest);

function handleRequest(req, res) {
  loadFile(req.url, req.headers['if-none-match'], function(body,notModified,etag) {
    var status;

    if (body) {
      status = notModified ? 304 : 200;
    } else {
      status = notModified ? 304 : 404;
    }

    var ct = '';

    if (req.url.indexOf('.css') !== -1) {
      ct = 'text/css';
    } else if (req.url.indexOf('.js') !== -1) {
      ct = 'text/javascript';
    } else if (req.url.indexOf('.html') !== -1) {
      ct = 'text/html';
    } else if (req.url.indexOf('.png') !== -1) {
      ct = 'image/png';
    }

    res.writeHead(status, {
      'content-type': ct,
      'cache-control': 'must-revalidate,private',
      'etag': etag
    });

    if (notModified) res.end();
    else res.end(body);
  });
}
