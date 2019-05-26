const fs = require("fs");
const tools = require('./tools');
const {preInfo} = require('./init');

// console.log(JSON.stringify(preInfo, null, 2))

const name = preInfo.worker;
const config = preInfo.config[name] || {};
const {COLOR, colorFont, run} = tools;

if (name !== undefined) {
  if (name !== 'init') {
    let {
      worker
    } = config;
    
    if(!worker) {
      const ndtWorkerPath = preInfo.ndtFilePath + '/workers/' + name;
      if(fs.existsSync(ndtWorkerPath)){
        worker = require(ndtWorkerPath);
      } else {
        console.log(colorFont('unknown worker: ' + name, COLOR.RED));
      }    
    }
    
    if(typeof worker === 'function') {
      worker(config, preInfo.params, preInfo.flags, preInfo, tools);
    } else {
      console.log(colorFont('worker must be function: ' + name, COLOR.RED));
    }
  }
} else {
  console.log(colorFont('no worker ', COLOR.RED));
}
