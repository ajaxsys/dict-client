/* A simple HttpServer.
 * Require node.js
 *
 * Run command:
 *   $ node server.js
 */
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

var port = 8443,
    mimeTypes = {
      "htm": "text/html",
      "html": "text/html",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "js": "text/javascript",
      "css": "text/css"
    };

http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), unescape(uri));
  var stats;

  try {
    console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + " - " + filename);
    stats = fs.lstatSync(filename); // throws if path doesn't exist
  } catch (e) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  }


  if (stats.isFile()) {
    // path exists, is a file
    var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
    res.writeHead(200, {'Content-Type': mimeType} );

    var readStream = fs.createReadStream(filename);
    readStream.on('error', function (err) { 
      res.end(err);
    });
    readStream.on('open', function () {
      // This just pipes the read stream to the response object (which goes to the client)
      readStream.pipe(res);
    });
  } else if (stats.isDirectory()) {
    // path exists, is a directory
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Index of '+uri+'<hr>');
    // show index
    res.write(showIndex(filename));

    res.write('</ul>');
    res.end();
  } else {
    // Symbolic link, other?
    // TODO: follow symlinks?  security?
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('500 Internal server error\n');
    res.end();
  }

}).listen(port);


function showIndex(dirName){
  var files = fs.readdirSync(dirName),
      res='<ul>';

    for (var i=0;i<files.length;i++) {
        var fname = files[i];
        if (fname.indexOf('.')===0)
            continue;
        res+='<li><a href="./'+fname+'">'+fname+'</a></li>';
    }
    return res+'</ul>';
}
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
