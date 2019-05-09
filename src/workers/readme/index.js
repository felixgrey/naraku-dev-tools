const http = require('http');
const fs = require("fs");
const path = require('path');
const {COLOR, colorFont, run} = require('naraku/tools');
const open = require('open');
const {readTextFile, createMarkdownHTML, injectToHtml, writeTextFile} = require('../../tools');

module.exports = function(config, params, flags, preInfo) {
  const {
    readmePath
  } = config;
  
  const server = http.createServer(function (request, response) {
    response.on('close',() => {
      setTimeout(() => {
        server.close();
      }, 20);
    });
    
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(readTextFile(readmePath));
  });  
  
  server.listen(8765); 
  open('http://localhost:8765'); 
};