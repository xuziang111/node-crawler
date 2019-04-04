//根据数据库信息获取缩略图
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


let pages = []


fs.readFile('./dmzj.txt', 'utf8', function(err, data){
    pages = JSON.stringify(data)
});



let allPage=[]
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'zhaobsh',
  password : 'Test163',
  database : 'dmzj_news'
});
// (?,?,?,?,?,?,?,?,?)
var modSql = 'UPDATE dmzj SET oage_img = ? WHERE Id = ?';
var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];

connection.connect();

connection.query(modSql,modSqlParams,function (err, result) {
    if(err){
          console.log('[UPDATE ERROR] - ',err.message);
          return;
    }        
   console.log('--------------------------UPDATE----------------------------');
   console.log('UPDATE affectedRows',result.affectedRows);
   console.log('-----------------------------------------------------------------\n\n');
 });
  


function savepage(news){
    mkfile(news)
}

let mkfile = (news)=>{
    let artilce_dir = './article/' + news.article_id
    // let content = ''

    allPage.push(news.href)

    fs.mkdir(artilce_dir,function(err){
        if (err) {
            return console.error(err);
        }
        //储存文章
        // mkarticle(news.local_article,content)

        // console.log(img)
        var src = {url:news.img,
            headers:{
                'Referer':'https://news.dmzj.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
            }
            }
            var writeStream = fs.createWriteStream(`${artilce_dir}/abstract.jpg`);
            var readStream = request(src)
            readStream.pipe(writeStream);

     });
}


let noteurls = []

let getNews = (res) => {
  let hotNews = [];
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。
  
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text, { decodeEntities: false });
	
  // 找到目标数据所在的页面元素，获取数据
  $('.briefnews_con_li').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let temp = cheerio.load(ele)
    // console.log(temp('h3 a').text())
    let news = {
 
    };    
    news.article_id = news.href.slice(news.href.lastIndexOf("/")+1,news.href.lastIndexOf(".")),  // 获取新闻网页链接
    news.local_article = './article/'+ news.article_id+'/'+news.article_id

    var  addSqlParams = [news.article_id,news.tittle,news.source,news.href,news.time,news.author,news.img,news.local_article,news.abstract];
    //创建储存文件夹

    savepage(news)
   
    //插入数据库
    connection.query(modSql,modSqlParams,function (err, result) {
        if(err){
              console.log('[UPDATE ERROR] - ',err.message);
              return;
        }        
       console.log('--------------------------UPDATE----------------------------');
       console.log('UPDATE affectedRows',result.affectedRows);
       console.log('-----------------------------------------------------------------\n\n');
     });

//本地储存地址


  });
};



pages.forEach(function(item){
    netpage = `https://news.dmzj.com/article/${item}.html`
    noteurls.push(netpage)
    console.log(netpage)
})

let concurrencyCount = 0

function savetext(noteurl,callback){
  console.time('  耗时');
        concurrencyCount++;
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
    
    
    getNews(res)


    }
  });
}

async.mapLimit(pages,1,function(noteurl,callback){
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