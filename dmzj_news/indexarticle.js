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
  password : 'Test6530',
  database : 'dmzj'
});
// (?,?,?,?,?,?,?,?,?)
connection.connect();
var  addSql = 'INSERT IGNORE INTO dmzj_news (article_id,title,publish_source,href,publish_date,publish_author,img_abstract,local_article,abstract,article_img,type,article) VALUES (?,?,?,?,?,?,NULL,?,?,NULL,?,?)';

var modSql = 'UPDATE dmzj_news SET article = ? WHERE article_id = ?';


let noteurls = [] //用来储存网页链接

let getNews = (res,noteurl) => {
  // 访问成功，请求页面所返回的数据会包含在res.text中。
  
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text, { decodeEntities: false });
if($('.news_content').text()===''){

}else{
	let news={}   
    news.article_id = noteurl.slice(noteurl.lastIndexOf("/")+1,noteurl.lastIndexOf(".")),  // 获取新闻网页链接
    news.local_article = './article/'+ news.article_id
  // 找到目标数据所在的页面元素，获取数据
  $('.news_content_info_r').remove()
  $('.bd_share').remove() 
  let type = $('.bq_ico').text()
    let title = $('.news_content_head h1').text()
    let publish_source = $('.data_from').text()
    let href = noteurl
    let date = $('.data_time').text()
    let author = $('.issuer_con span h3 a').text()
    let abstract = $('.news_content_con p:nth-child(1)').text().trim()
    let article = $('.news_content').html()

  var  addSqlParams = [news.article_id,title,publish_source,href,date,author,news.local_article,abstract,type,article]
  var modSqlParams = [article,news.article_id];

//插入
connection.query(addSql,addSqlParams,function (err, result) {
  if(err){
   console.log('[INSERT ERROR] - ',err.message);
   return;
  }        

 console.log('--------------------------INSERT----------------------------');       
 console.log('-----------------------------------------------------------------\n\n');  
 result=''
 news=''
 addSqlParams=''
 modSqlParams=''
});

//已存在就更新

connection.query(modSql,modSqlParams,function (err, result) {
  if(err){
    console.log('[INSERT ERROR] - ',err.message);
    return;
   }        
 
  console.log('--------------------------INSERT----------------------------');
  //console.log('INSERT ID:',result.insertId);        
  console.log('INSERT ID:',result);        
  console.log('-----------------------------------------------------------------\n\n'); 
  result='' 
 });
}
$=''
};


//循环键加载的页面
for(let i=45358;i<62481;i++){
  netpage = `https://news.dmzj.com/article/${i}.html`
  noteurls.push(netpage)
}

let concurrencyCount = 0


//插入表函数
function savetext(noteurl,callback){
  console.time('  耗时');
  concurrencyCount++;
  //superagent访问页面来获取内容，获取到的内容通过getNews处理
  superagent.get(noteurl).end((err, res) => {
    if (err) {
      // 如果访问失败或者出错，会这行这里
      console.log(`抓取失败 - ${err}`)
      console.log('并发数:', concurrencyCount--, 'fetch');
      callback(null,err)
    } else {
      console.log('并发数:', concurrencyCount--, 'fetch');
      callback(null,[noteurl,res.text])  
    getNews(res,noteurl)
    }
  });
}

//按线程执行
async.mapLimit(noteurls,10,function(noteurl,callback){
  savetext(noteurl, callback)
  console.timeEnd("结束")
},function(err,data){
  console.log(err)
})

// connection.end();
