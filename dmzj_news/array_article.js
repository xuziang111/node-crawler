var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('../node_modules/superagent');
const cheerio = require('../node_modules/cheerio');
var async = require('../node_modules/async')
var mysql      = require('../node_modules/mysql');
var request = require('../node_modules/request');

let allPage=[]
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'zhaobsh',
  password : 'Test163',
  database : 'dmzj_news'
});
// (?,?,?,?,?,?,?,?,?)
connection.connect();

var  sql = 'SELECT * FROM dmzj';
console.log(sql)
connection.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      return;
    }

   console.log('--------------------------SELECT----------------------------');
//    console.log(result);
   result.forEach(function(ele,index){
       console.log(ele)
    allPage.push(ele.article_id)
   })
   console.log(allPage)
   console.log('------------------------------------------------------------\n\n');  
});

connection.end();






//--------------------------------------------------------
if(!port){
  console.log('请指定端口号 例如\nnode server.js 8888')
  process.exit(1)
}
var server = http.createServer(function(request, response){
	console.log(request.url)

     // 输出响应头
     response.writeHead (200, {'Content-Type' : 'text/html;charset=utf-8'});
     // 写内容
     response.write('xxx'.toString('utf-8'));
     // 结束，如果不写，请求一直处于pedding状态，可注释做测试
     response.end();

function readBody(request){
  return new Promise((resolve,reject) => {
    let body = [];
    request.on('data',(chunk) => {
      body.push(chunk)
    }).on('end',() => {
    body = Buffer.concat(body).toString();
    resolve(body)
    })
  })
}
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)