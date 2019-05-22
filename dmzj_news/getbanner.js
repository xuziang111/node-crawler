var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('../node_modules/superagent');
const cheerio = require('../node_modules/cheerio');
var async = require('../node_modules/async')




superagent.get('https://news.dmzj.com/').end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`热点新闻抓取失败 - ${err}`)
  } else {
   // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
   // 抓取热点新闻数据
   hotNews = getNews(res)
   savetext(hotNews)
  }
});



let getNews = (res) => {
  let hotNews = [];
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。
  
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text);
	
  // 找到目标数据所在的页面元素，获取数据
  $('.rank_tabs_li').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let temp = cheerio.load(ele)
    // console.log(temp('h3 a').text())
    let news = {
      title: temp('.rank_tabs_title a').text(),        // 获取新闻标题
      href: temp('.rank_tabs_title a').attr('href') ,   // 获取新闻网页链接
      time:temp('.rank_tabs_sec').text() ,
    };
    console.log(news)    

    hotNews.push(news)              // 存入最终结果数组
  });
  return hotNews
};


let concurrencyCount = 0
function savetext(res){
     fs.writeFile('hot/hot.json',JSON.stringify(res),'utf8',function(error){
      if(error){
          console.log(error);
          return false;
      }
      console.log('写入成功hot');
    })
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