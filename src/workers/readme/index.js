const http = require('http');
const fs = require("fs");
const path = require('path');

module.exports = function(config, params, flags, preInfo, {COLOR, colorFont, run}) {
  const {
    readmePath
  } = config;
  
  if(!readmePath || !fs.existsSync(readmePath)) {
    console.log(colorFont('not found readme', COLOR.RED));
    return;
  }
  
  const server = http.createServer(function (request, response) {   
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(readTextFile(readmePath), () => {

    });
  });  
  
  server.listen(8765); 
  open('http://localhost:8765'); 
};