var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('../node_modules/superagent');
const cheerio = require('../node_modules/cheerio');
var async = require('../node_modules/async')
var mysql      = require('../node_modules/mysql');
let z=0
for(let i=60025;i<=61713;i++){
    let article
    try {
        fs.readFile(`./article/${i}/${i}`,'utf-8',function(err,data){
            if(err){
                z++
            }else{
                let $ = cheerio.load(data, { decodeEntities: false });
                // $('.news_content').html()
                Array.prototype.forEach.call($('img'),function(ele,index){
                    $(ele).attr('src',`./article/${i}/${index}.jpg`)
                    $(ele).attr('title',index)
                    $(ele).atstr('alt',index)
                    
                })
                console.log($.html())
                
                
                
                
                    fs.writeFile(`./article/${i}/${i}` ,$.html(),'utf8',function(error){
                        if(error){
                            console.log(error);
                            z++
                            return false;
                        }
                        console.log('写入成功'+`./article/${i}/${i}`);
                        z++
                        console.log(z)
                      })
            }
            
        })
        // let $ = cheerio.load(article, { decodeEntities: false });

        // Array.prototype.forEach.call($('img'),function(ele,i){
        //     $(ele).attr('src',i)
        //     $(ele).attr('title',i)
        //     $(ele).attr('alt',i)
            
        // })
        // console.log($.html())
        
        
        
        
        //     fs.writeFile(`./article/${i}/${i}` ,$.html(),'utf8',function(error){
        //         if(error){
        //             console.log(error);
        //             return false;
        //         }
        //         console.log('写入成功'+`./article/${i}/${i}`);
        //       })
      } catch(e) {
        console.log(e);
      }
    
  }





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