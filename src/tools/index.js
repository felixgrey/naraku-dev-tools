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

var exec = require('child_process').exec;

var COLOR = {
  BLACK: '0;30',
  RED: '0;31',
  GREEN: '0;32',
  WATER: '1;36',
  GREY: '1;30',
  YELLOW: '1;33',
  BLUE: '0;34',
  L_BLUE: '1;34',
  L_PURPE: '1;35' 
};

function colorFont(text, color) {
  if(!color) {
    return text;
  }
  return '\033[' + color + 'm' + text + '\033[0m';
}

function run(command, echo = true) {
  return new Promise(function(resolve, reject) {
    if (echo) {
      console.log(colorFont('run: ', COLOR.L_BLUE), command);
    }
    exec(command, function(err, stdout, stderr){
      if(err) {
        console.log(stderr);
        reject(stderr);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

function runList(list) {
  let runIt = Promise.resolve();
  list.forEach(cmd => {
    runIt = runIt.then(() => run(cmd));
  });
  return runIt;
}

module.exports = {
  upperCase0,
  readTextFile,
  createMarkdownHTML,
  injectToHtml,
  writeTextFile,
  jsonStringifyWithDoc,
  COLOR,
  colorFont,
  run,
  runList
};
