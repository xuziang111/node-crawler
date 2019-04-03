var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('../node_modules/superagent');
const cheerio = require('../node_modules/cheerio');
var async = require('../node_modules/async')
var mysql      = require('../node_modules/mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'zhaobsh',
  password : 'Test163',
  database : 'dmzj_news'
});
// (?,?,?,?,?,?,?,?,?)
connection.connect();
var  addSql = 'INSERT IGNORE INTO dmzj (article_id,tittle,publish_source,href,publish_date,publish_author,img_src,local_article,abstract) VALUES (?,?,?,?,?,?,?,?,?)';


 

let noteurls = []

let getNews = (res,noteurl) => {
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。
  
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text, { decodeEntities: false });
	
  // 找到目标数据所在的页面元素，获取数据
  $('.news_content_con').text()
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    // console.log(temp('h3 a').text())
let news={}   
    news.article_id = noteurl.slice(noteurl.lastIndexOf("/")+1,noteurl.lastIndexOf(".")),  // 获取新闻网页链接
    news.local_article = './article/'+ news.article_id
console.log(news)

fs.mkdir(news.local_article,function(err){
    if (err) {
        return console.error(err);
    }
    console.log("目录创建成功。");
 });

//本地储存地址
fs.writeFile(news.local_article + '/' + news.article_id ,$('.news_content_con').html(),'utf8',function(error){
  if(error){
      console.log(error);
      return false;
  }
  console.log()
  console.log('写入成功'+news.article_id);
})


};



for(let i=1;i<61598;i++){
  netpage = `https://news.dmzj.com/article/${i}.html`
  noteurls.push(netpage)
}

let concurrencyCount = 0

function savetext(noteurl,callback){
  console.time('  耗时');
        concurrencyCount++;
  superagent.get(noteurl).end((err, res) => {
    if (err) {
      // 如果访问失败或者出错，会这行这里
      console.log(`抓取失败 - ${err}`)
      console.log('并发数:', concurrencyCount--, 'fetch');
      callback(null,err)
    } else {
      console.log('并发数:', concurrencyCount--, 'fetch');
      callback(null,[noteurl,res.text])
    //  let $ = cheerio.load(res.text);
    
    
    getNews(res,noteurl)


    }
  });
}

async.mapLimit(noteurls,50,function(noteurl,callback){
  savetext(noteurl, callback)
  console.timeEnd("  耗时")
},function(err,data){
  console.log(err)
})

// connection.end();






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