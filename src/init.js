const fs = require("fs");
const os = require('os');
const path = require('path');

const platform = os.platform();
const currentPath = process.cwd().replace(/\\/g, '/');
const mode = process.env.NDT_NODE_ENV;
const [nodePath, runPath, worker,..._params] = Array.from(process.argv);
const ndtRunPath = path.resolve(runPath, '../').replace(/\\/g, '/');

const params = {};
const flags = {};

function paramToObj(text = '') {
  const eqIndex = text.indexOf('=');
  if(eqIndex === -1) {
    return {[text]: null};
  }
  return {[text.substr(0, eqIndex)]: text.substr(eqIndex+1)};
}

exports.paramToObj = paramToObj;

_params.forEach(p => {
  let objP = paramToObj(p);
  for(let key in objP) {
    const value = objP[key];
    if(/^--/.test(key)){
      const subFlags = key.substr(2).split('-');
      const pKey = subFlags.shift();
      flags[pKey] = {subFlags, value};
    } else {
      params[key] = value;
    }
  }
});

let config = {};
const _cfgp = currentPath + '/ndt.config.js';
const _gulp = currentPath + '/gulpfile.js';
if (!fs.existsSync(_gulp)) {
  const _t = fs.readFileSync(__dirname + '/../config/gulpfile.js', 'utf-8');
  fs.writeFileSync(_gulp, _t, 'utf-8');
}
if(fs.existsSync(_cfgp)) {
  config = require(_cfgp);
} else if(mode === 'test') {
  config = require(__dirname + '/test.ndt.config.js');
} else if (worker === 'init') {
  const _t = fs.readFileSync(__dirname + '/../config/ndt.config.js', 'utf-8');
  fs.writeFileSync(_cfgp, _t, 'utf-8');
  //console.log(`cp -r ${__dirname}/workers/* ${currentPath}/ndt-workers`)
  config = require(_cfgp);
}

exports.preInfo = {
  nodePath,
  currentPath: currentPath,
  ndtRunPath,
  ndtFilePath: __dirname,
  mode,
  config,
  platform,
  worker,
  params,
  flags
};
