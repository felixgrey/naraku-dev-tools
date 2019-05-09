const fs = require("fs");
const path = require('path');
const MarkdownIt = require('markdown-it');

const currentPath = process.cwd().replace(/\\/g, '/');

function readTextFile(filePath){
  return fs.readFileSync(path.resolve(currentPath, filePath) , 'utf-8');
}

function createMarkdownHTML(filePath) {
  return new MarkdownIt().render(readTextFile(filePath));
}

function injectToHtml(templateText, name, mdText) {
  return templateText.replace(new RegExp('<!--inject:'+name+'-->', 'gi'), mdText); 
}

function writeTextFile(outPath, text) {
  fs.writeFileSync(path.resolve(currentPath, outPath), text, 'utf-8'); 
}

module.exports = {
  readTextFile,
  createMarkdownHTML,
  injectToHtml,
  writeTextFile
};
