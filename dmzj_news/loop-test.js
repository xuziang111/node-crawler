var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('../node_modules/superagent'); //爬网页
const cheerio = require('../node_modules/cheerio'); //解析网页
var async = require('../node_modules/async') //处理并发
var mysql      = require('../node_modules/mysql'); //mysql操作
var request = require('../node_modules/request');

var schedule = require('node-schedule'); //循环操作
var rule = new schedule.RecurrenceRule();
rule.hour = [8,9,10,11,12,13,14,15,16,17,18,19,20];
rule.minute = [12]
rule.second=[20]
//插入语句

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'zhaobsh',
    password : 'Test6530',
    database : 'dmzj'
});
var  addSql = 'INSERT IGNORE INTO dmzj_news_all (article_id,title,publish_source,href,publish_date,publish_author,img_abstract,local_article,abstract,article_img,type,article) VALUES (?,?,?,?,?,?,NULL,?,?,NULL,?,?)';   
// (?,?,?,?,?,?,?,?,?)
connection.connect();

let concurrencyCount = 0

let articleid,checkpoint

function loopfn(){
    checkpoint = fs.readFileSync('data/checkpoint.json','utf-8')
    console.log(checkpoint)
    let getNews = (res,noteurl) => {
        // 访问成功，请求页面所返回的数据会包含在res.text中。
        
        /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
           以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
         */
        let img_type=[]
        let $ = cheerio.load(res.text, { decodeEntities: false });
        //判断新闻是否存在
        if($('.news_content').text()===''){

        }else{
            let news={} 
            news.article_id = noteurl.slice(noteurl.lastIndexOf("/")+1,noteurl.lastIndexOf(".")),  // 获取新闻网页链接
            news.local_article = './article/'+ news.article_id
            // 移除分享
            $('.news_content_info_r').remove()
            $('.bd_share').remove() 
            // 找到目标数据所在的页面元素，获取数据
            let type = $('.bq_ico').text()
            let title = $('.news_content_head h1').text()
            let publish_source = $('.data_from').text()
            let href = noteurl
            let date = $('.data_time').text()
            let author = $('.issuer_con span h3 a').text()
            let abstract = $('.news_content_con p:nth-child(1)').text().trim() 
            //创建文件夹储存图片
            fs.mkdir(news.local_article,function(err){
                if (err) {
                    return console.error(err);
                }
                console.log("目录创建成功。");
            });
            //储存页面图片链接
            let tempurl=[]
            //循环生成图片链接，和文章id
            $('.news_content_con img').each((idx, ele) => {
                if(ele.attribs.src){ 
                    //https://news.dmzj.com/article/${i}.html
                    let id = noteurl.slice(noteurl.lastIndexOf("/")+1,noteurl.lastIndexOf("."))
                    tempurl.push({id:id,src:ele.attribs.src,name:idx})
                    let img_name = ele.attribs.src.slice(ele.attribs.src.lastIndexOf(".")+1)
                    console.log(img_name)
                    img_type.push(img_name)
                }  
            });

            fs.writeFile(news.local_article + '/' + news.article_id +'img',JSON.stringify(tempurl),'utf8',function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('图片地址写入成功');
              })

            //循环更改图片地址
            Array.prototype.forEach.call($('.news_content img'),function(ele,index){
                console.log('z')
                console.log(img_type[index])
                $(ele).attr('src',`./article/${news.article_id}/${index}.${img_type[index]}`)
                $(ele).attr('title',index)
                $(ele).attr('alt',index)
                // console.log(ele)
            })   
            let article = $('.news_content').html()
            let  addSqlParams = [news.article_id,title,publish_source,href,date,author,news.local_article,abstract,type,article]
            //插入
            connection.query(addSql,addSqlParams,function (err, result) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }        
                console.log('插入成功')
                result=null
            });
                news=null
                addSqlParams=null
        }  
        $=null
    };
      
      
      
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
      function startwork(noteurls){
        async.mapLimit(noteurls,10,function(noteurl,callback){
            //进行加载
            savetext(noteurl, callback)
            console.timeEnd("  耗时")
          },function(err,data){
              let tempimgs=[]
                for(let i = checkpoint;i<=articleid;i++){
                        if(fs.existsSync(`./article/${i}/${i}img`)){
                            if(fs.readFileSync(`./article/${i}/${i}img`,'utf-8') != null){
                                string = JSON.parse(fs.readFileSync(`./article/${i}/${i}img`,'utf-8'))
                                string.forEach(element => {
                                    tempimgs.push(element)
                                });
                            }
                        }
                }
                // console.log('tempimgs')
                // console.log(tempimgs)
                //每个图片延时i
                let i =100
                //下载图片
                async.mapLimit(tempimgs,1,function(tempimg,callback){
                    console.time('  耗时');
                    setTimeout(function() {
                        i++                            
                    var src = {
                        url:tempimg.src,
                        headers:{
                            'method': 'GET',
                            'Referer':`https://news.dmzj.com`,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                        }
                    }
                    let img_name = tempimg.name
                    let img_type
                    if(tempimg.src.lastIndexOf("?") != -1){
                        img_type = tempimg.src.slice(tempimg.src.lastIndexOf(".")+1,tempimg.src.lastIndexOf("?"))
                    }else{
                        img_type = tempimg.src.slice(tempimg.src.lastIndexOf(".")+1)
                    }
                    console.log(img_type)
                    var writeStream = fs.createWriteStream(`article/${tempimg.id}/${img_name}.${img_type}`);
                    var readStream = request(src)
                    readStream.pipe(writeStream);
                    process.on('uncaughtException', function (err) {
                        console.log(err)
                    }); 
                    console.timeEnd("  耗时")
                    console.log(i)
                   console.log('下载完成')
                    callback(null,'x')
                    }, i);
                  },function(err,data){
                    console.log(err)
                  }) 
          })   
      }

      //开始执行
      function getpagenum(){
        //访问首页，获取最新的新闻编号
        superagent.get('https://news.dmzj.com/p1.html').end((err, res) => {
            if (err) {
              // 如果访问失败或者出错，会执行这里
    
              console.log(err)
            } else {
                let $ = cheerio.load(res.text, { decodeEntities: false });
                console.log($('.briefnews_con .briefnews_con_li .li_img_de h3 a').attr('href'))
                temphref = $('.briefnews_con .briefnews_con_li .li_img_de h3 a').attr('href') 
                articleid = temphref.slice(temphref.lastIndexOf("/")+1,temphref.lastIndexOf(".")) - 0
                // console.log('articleid')
                // console.log(articleid)
                // console.log('checkpoint')
                // console.log(checkpoint)
                if(articleid>checkpoint){ //判断是否更新
                    //循环键加载的页面
                    fs.writeFile('data/checkpoint.json',JSON.stringify(articleid),'utf8',function(error){
                        if(error){
                            console.log(error);
                            return false;
                        }
                        console.log('ck写入成功');
                      })
                    let netpage
                    let noteurls = []
                    //循环生成要加载的网页
                    for(let i=checkpoint;i<=articleid;i++){
                        netpage = `https://news.dmzj.com/article/${i}.html`
                        noteurls.push(netpage)
                    }
                    netpage = null
                    //开始执行加载
                    startwork(noteurls)
                }else{
                    console.log('没有更新')
                }
                 
                temphref=null
            }
          });
    }
    getpagenum()
}






loopfn()




var j = schedule.scheduleJob(rule, function(){
console.log('haha')
    // loopfn()
    // connection.end()
});

