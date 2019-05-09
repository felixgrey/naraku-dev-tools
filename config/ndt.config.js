var path = require('path');
var ndtPath = path.resolve(process.argv[1], '../../');
 // var someWorker = require(path.resolve(__dirname, './someWorker'));

module.exports = {
  /*
     简单的控制台文字颜色工具 示例
  */
  colorFont: {
    
  },
  /*
   naraku的readme页面，控制台输入 nth readme即可
  */
  readme: { // 页面路径
    readmePath: ndtPath +  '/src/workers/readme/readme.html,'
  },
  /*
          这个是自带的swagger工具
         支持的功能：
    apiList： 构建ApiList文件，保存了所有的api信息可以用来批量生成请求代码。
    tagApi： 根据选择的tag，在控制台输出DataHub.inject代码模板。必须是api显式定义的tag，用来标记api所属页面，不可以是controller自动生成的Tag，  例如：tagApi=首页
  */ 
  swagger: { // swagger工具配置
    // 项目根目录下的apiDocDemo.js文件保存了swaggerDocs返回的接送对象，并且通过module.exports导出
    // localDocs: require(path.resolve(__dirname, './apiDocDemo.js')), // 本地swaggerDocsJson对象,如果有，优先使用
    http: { //swagger服务器
      host: 'localhost',
      path: '/v2/api-docs',
      port: '8080'
    },
    toApiListText: (list) => { // 生成的ApiList文件内容
      return 'export default ' + JSON.stringify(list, null, 2) + ';\n';
    },
    outPath: path.resolve(__dirname, './apiList.js'), // ApiList输出地址
    convention: {  // 约定规范  
      pageParam: { // 分页相关的参数名称约定
        page: 'page', // 当前页码
        size: 'size', // 每页数据条数
        count: 'count' // 总数据树
      },
      pageSize: 10 // 默认每页数据条数
    }
  }
}