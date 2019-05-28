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

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'zhaobsh',
  password : 'Test6530',
  database : 'dmzj'
});
// (?,?,?,?,?,?,?,?,?)
connection.connect();

var  addSql = 'INSERT IGNORE INTO dmzj_news (article_id,title,publish_source,href,publish_date,publish_author,img_abstract,local_article,abstract,article_img,type) VALUES (?,?,?,?,?,?,NULL,?,?,NULL,?)';

 

let noteurls = []

let getNews = (res,noteurl) => {
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。
  
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text, { decodeEntities: false });
  let img_type=[]
  let news={}   
    news.article_id = noteurl.slice(noteurl.lastIndexOf("/")+1,noteurl.lastIndexOf("_")),  // 获取网页id
    news.local_article = './article/'+ news.article_id
//------------获取文章---------------
    $('.news_content_info_r').remove()
    //去除分享
    $('.bd_share').remove() 
    let type = $('.bq_ico').text()//种类
      let title = $('.news_content_head h1').text()//标题
      let publish_source = $('.data_from').text()//来源
      let href = noteurl //链接
      let date = $('.data_time').text() //日期
      let author = $('.issuer_con span h3 a').text() //作者
      let abstract = $('.news_content_con p:nth-child(1)').text().trim() //简介
      let addSqlParams = [news.article_id,title,publish_source,href,date,author,news.local_article,abstract,type]
  //将文章插入进表
  connection.query(addSql,addSqlParams,function (err, result) {
    if(err){
     console.log('[INSERT ERROR] - ',err.message);
     return;
    }        
  
   console.log('--------------------------INSERT----------------------------');  
   console.log('INSERT ID:',result);        
   console.log('-----------------------------------------------------------------\n\n');  
  });
  //



    fs.mkdir(news.local_article,function(err){
        if (err) {
            return console.error(err);
        }
        console.log("目录创建成功。");
     });
    $('.news_content_info_r').remove()
    $('.bd_share').remove() 
    console.log(1)
    console.log($('.news_content_con').html())
  // 找到目标数据所在的页面元素，获取数据
  $('.news_content_con img').each((idx, ele) => {
    if(ele.attribs.src){
// try{
  // console.log(ele.attribs.src)

  var src = {url:ele.attribs.src,
      headers:{
        'method': 'GET',
          'Referer':`https://news.dmzj.com`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
      }
      }
      let img_name = ele.attribs.src.slice(ele.attribs.src.lastIndexOf(".")+1)
      // console.log(img_name)
      img_type.push(img_name)
  var writeStream = fs.createWriteStream(`article/${news.article_id}/${idx}.${img_name}`);
  var readStream = request(src)
      // console.log(news.article_id )
      readStream.pipe(writeStream);
      process.on('uncaughtException', function (err) {

      });  
    }  
  });



  Array.prototype.forEach.call($('.news_content img'),function(ele,index){
    console.log('z')
    console.log(img_type[index])
    $(ele).attr('src',`./article/${news.article_id}/${index}.${img_type[index]}`)
    $(ele).attr('title',index)
    $(ele).attr('alt',index)
    // console.log(ele)
})
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    // console.log(temp('h3 a').text())
    // console.log('2')
    // console.log($('.news_content').html())




    fs.writeFile(news.local_article + '/' + news.article_id ,$('.news_content').html(),'utf8',function(error){
      if(error){
          console.log(error);
          return false;
      }
      console.log()
      console.log('写入成功'+news.article_id);
    })
};


//12900
//14372
//45355
//46796

for(let i=61713;i<62422;i++){
  netpage = `https://news.dmzj.com/article/${i}_all.html`
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

async.mapLimit(noteurls,2,function(noteurl,callback){
  savetext(noteurl, callback)
  console.timeEnd("  耗时")
},function(err,data){
  console.log(err)
})

// connection.end();






//--------------------------------------------------------
// if(!port){
//   console.log('请指定端口号 例如\nnode server.js 8888')
//   process.exit(1)
// }
// var server = http.createServer(function(request, response){
// 	console.log(request.url)

//      // 输出响应头
//      response.writeHead (200, {'Content-Type' : 'text/html;charset=utf-8'});
//      // 写内容
//      response.write('xxx'.toString('utf-8'));
//      // 结束，如果不写，请求一直处于pedding状态，可注释做测试
//      response.end();

// function readBody(request){
//   return new Promise((resolve,reject) => {
//     let body = [];
//     request.on('data',(chunk) => {
//       body.push(chunk)
//     }).on('end',() => {
//     body = Buffer.concat(body).toString();
//     resolve(body)
//     })
//   })
// }
// })

// server.listen(port)
// console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)