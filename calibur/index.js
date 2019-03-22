
var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('superagent');
const cheerio = require('cheerio');


let xxx,name
loadPage()
setInterval(loadPage,60000)

function loadPage(){
    superagent.get('https://api.calibur.tv/cartoon_role/list/idols?type=trending&sort=activity&state=1').end((err, res) => {
        if (err) {
          // 如果访问失败或者出错，会这行这里
          console.log(`抓取失败 - ${err}`)
        } else {
         // 访问成功
         console.log(res.text)
          xxx=res.text
		  console.log(JSON.parse(xxx))
		let name = new Date()
		name = name.getTime()
      fs.writeFile(name+'.json',res.text,'utf8',function(error){
          if(error){
              console.log(error);
              return false;
          }
          console.log('写入成功');
        })
      }
      });
      
}

if(!port){
  console.log('请指定端口号 例如\nnode server.js 8888')
  process.exit(1)
}

var server = http.createServer(function(request, response){
	console.log(request.url)

     // 输出响应头
     response.writeHead (200, {'Content-Type' : 'text/html;charset=utf-8'});
     // 写内容
     response.write(xxx);
     // 结束，如果不写，请求一直处于pedding状态，可注释做测试
     response.end();
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)