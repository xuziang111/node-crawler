var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('superagent');
const cheerio = require('cheerio');
var async = require('async')

let noteurls = []

let j = 0
for(let i=2000;i<3000;i++){
  if(i>=1000&&i<2000){
    j=1
  }else if(i>=2000){
    j=2
  }
  netpage = `http://dl.wkcdn.com/txtutf8/${j}/${i}.txt`
  noteurls.push(netpage)
  console.log(netpage)
}
let concurrencyCount = 0
function savetext(noteurl,callback){
  console.time('  耗时');
        concurrencyCount++;
        let i = noteurl.slice(noteurl.lastIndexOf("/")+1,noteurl.lastIndexOf("."))
  superagent.get(noteurl).end((err, res) => {
    if (err) {
      // 如果访问失败或者出错，会这行这里
      console.log(`抓取失败 -${i}- ${err}`)
      console.log('并发数:', concurrencyCount--, 'fetch');
      callback(null,err)
    } else {
      console.log('并发数:', concurrencyCount--, 'fetch');
      callback(null,[noteurl,res.text])
    //  let $ = cheerio.load(res.text);
    
     fs.writeFile('data/'+i+'.txt',res.text,'utf8',function(error){
      if(error){
          console.log(error);
          return false;
      }
      console.log('写入成功'+i);
    })
    }
  });
}

async.mapLimit(noteurls,50,function(noteurl,callback){
  savetext(noteurl, callback)
  console.timeEnd("  耗时")
},function(err,data){
  console.log(err)
})

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