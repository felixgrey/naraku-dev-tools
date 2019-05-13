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

function jsonStringifyWithDoc(text) {
  return JSON.stringify(text, null, 2)
        .replace(/"[_]{3,5}":\s+"\/\*/g,'/*').replace(/\*\/"[,]?/g, '*/')
        .replace(/\n\s{2,4}\/\*/g, ' /*');
}

function upperCase0(text = '') {
  return `${text}`.replace(/^[a-z]{1}/, a => a.toUpperCase());
}

module.exports = {
  upperCase0,
  readTextFile,
  createMarkdownHTML,
  injectToHtml,
  writeTextFile,
  jsonStringifyWithDoc
};
