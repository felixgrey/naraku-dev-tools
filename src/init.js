const fs = require("fs");
const os = require('os');
const path = require('path');

const platform = os.platform();
const currentPath = process.cwd().replace(/\\/g, '/');
const mode = process.env.NDT_NODE_ENV;
const [,,worker,..._params] = Array.from(process.argv);

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

let config = null;
const _cfgp = currentPath + '/ndt.config.js';
if(fs.existsSync(_cfgp)) {
  config = require(_cfgp);
} else if(mode === 'test') {
  config = require(currentPath + '/test.ndt.config.js');
} else {
  const _t = fs.readFileSync(preInfo.ndtPath + '/../config/ndt.config.js', 'utf-8');
  fs.writeFileSync(_cfgp, _t, 'utf-8');
  config = require(_cfgp);
}

exports.preInfo = {
  currentPath: currentPath,
  ndtPath: __dirname,
  mode,
  config,
  platform,
  worker,
  params,
  flags
};