const http = require('http');
const BufferHelper = require('./bufferhelper');
const fs = require("fs");
const {COLOR, colorFont, run} = require('naraku/tools');

module.exports = function(config, params, flags, preInfo){
  const {
      http: httpParam = {},
      outPath = './apiList.js',
      convention = {},
      toApiListText = (list) => {
        return JSON.stringify(list, null, 2);
      },
      localDocs
  } = config;
  
  const {
    pageParam = {},
    pageSize = 10
  } = convention;
  
  const {
    page = 'page',
    size = 'size',
    count = 'count'
  } = pageParam;
  

  let docPromise;
  if(!localDocs){
    docPromise = new Promise((resolve) => {
      const bufferHelper = new BufferHelper();
      http.get({
        host: httpParam.host || 'localhost',
        path: httpParam.path || '/v2/api-docs',
        port: httpParam.port || '8080',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'UTF-8'
        }
      }, function(res) {
        res.on("data", function(chunk){
            bufferHelper.concat(chunk);
        });
        res.on('end', function() {
          const apiData = JSON.parse(bufferHelper.toBuffer().toString('UTF-8'));
          resolve(apiData);
        });
      });
    });
  } else {
    docPromise = Promise.resolve(localDocs);
  }

  docPromise.then((apiData) => {
    const {
      paths = {},
      tags = []
    } = apiData;
    
    let apiList = [];
    const controllerTagNames = tags.map(a => a.name);
    const apiByTag = {};
    
    Object.keys(paths).forEach(key => {
      const item = paths[key];
      const {get, post} = item;
      const _info = post || get || {};
      const info = {};

      (_info.tags || []).forEach(tag => {
        if (controllerTagNames.indexOf(tag) !== -1 ) {
          return;
        }
        if (!apiByTag[tag]) {
          apiByTag[tag] = [];
        }
        apiByTag[tag].push(info); 
      });
      apiList.push(info);
      
      info.method = post ? 'post' : 'get';  
      info.url = key;
      info.name = _info.operationId.replace(/UsingGET|UsingPOST/g,'');
      info.description = _info.description || "-";
      info.paramFields = [];
      const parameters = _info.parameters || [];
      let _page = false;
      let _size = false;
      for (let param of parameters) {
        info.paramFields.push(param.name);
        if(param.required) {
          info.dependence = true;
        }
        if(param.name === page) {
          _page = true;
        }
        if(param.name === size) {
          _size = true;
        }
      }
      info.pagenation = _page && _size;
    });
    apiList = toApiListText(apiList);

    if(params.apiList !== undefined) {
      let _outPath = flags.op ? flags.op.value : outPath;
      if(/^\.\//g.test(_outPath)){
        _outPath = preInfo.currentPath + _outPath;
      }
      //fs.writeFileSync(_outPath, '' + apiList, 'utf-8');     
    }
    
    const apiTagName = params.tagApi;
    if(apiTagName) {
      const injectConfig = {
      };
      (apiByTag[apiTagName] || []).forEach(info => {
        const {
          name,
          dependence,
          method,
          pagenation,
          description,
          paramFields
        } = info;
        
        const dataConfig = {
          ___: '/* ' + description + ' */',
          type: method + name.replace(/^[a-z]{1}/, a => a.toUpperCase()),
        };
        injectConfig[name] = dataConfig;
        
        if(dependence) {
          const depName = name + 'BusiDep';
          dataConfig.dependence = dataConfig.dependence || [];
          dataConfig.dependence.push(depName);
          injectConfig[depName] = {
            ___: '/* '+ name + '的请求参数：'+ 
              paramFields.filter(a => a !== page && a !== size).join(',') +' */',
          };
        }
        
        if(pagenation) {
          const depName = name + 'PageDep';
          dataConfig.dependence = dataConfig.dependence || [];
          dataConfig.dependence.push(depName);
          injectConfig[depName] = {
            ___: '/* ' + name + '的分页 */',
            default: {
              [page]: 1,
              [size]: pageSize
            }
          }
        }
      });
      
      let injectConfigString = JSON.stringify(injectConfig, null, 2)
        .replace(/"[_]{3,5}":\s+"\/\*/g,'/*').replace(/\*\/"[,]?/g, '*/')
        .replace(/\n\s{2,4}\/\*/g, ' /*');
      injectConfigString = '/* --' + apiTagName + '-- */\n@DataHub.inject(' + injectConfigString + ')\n';
      console.log(colorFont(injectConfigString, COLOR.WATER));
    }
    
    //console.log(JSON.stringify(apiList, null, 2));
  });
  
};
