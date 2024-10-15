// Create web server
var http = require('http');
// Create file system object
var fs = require('fs');
// Create path object
var path = require('path');
// Create url object
var url = require('url');
// Create querystring object
var querystring = require('querystring');

// Create server
http.createServer(function(req, res) {
  // Get request url
  var url_parts = url.parse(req.url, true);
  // Get query string
  var query = url_parts.query;
  // Get path name
  var pathname = url_parts.pathname;
  // Get method
  var method = req.method;
  console.log("Request for " + pathname + " received.");

  // Route to write comment
  if (pathname == '/write_comment') {
    // Read data from request
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      // Parse data
      var post = querystring.parse(body);
      // Get comment
      var comment = post['comment'];
      // Write comment to file
      fs.appendFile('comments.txt', comment + '\n', function(err) {
        if (err) {
          console.log(err);
        }
      });
      // Send response
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('Comment received: ' + comment);
      res.end();
    });
  } else {
    // Read comments from file
    fs.readFile('comments.txt', function(err, data) {
      if (err) {
        console.log(err);
      }
      // Send response
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
}).listen(8080);
console.log("Server running at http://localhost:8080/");