var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

var mysql      = require('../node_modules/mysql');
const express = require('../node_modules/express')
const app = express()
app.use('/',express.static('Public'))
app.use(express.static(__dirname));


app.listen(8080, () => {
    console.log(`App listening at port 8080`)
  })
  app.get('/', (req, res) => {
    let string = fs.readFileSync('./index.html','utf-8')
    res.send(string)
  })
  app.get('/article/:id', (req, res) => {
    let string
    try{
      string = fs.readFileSync(`./article/${req.params.id}/${req.params.id}`,'utf-8')
      res.send(string)
    }catch(err){
      console.log(err)
      res.send(`<h1>该新闻还未审核通过或已被删除</h1>`)
    }

  })  
  app.get('/index/article/:id', (req, res) => {
    console.log(req.params) 
    console.log(req.path)
    let xxx = req.path.split('/')
    console.log(xxx[1])
    let searchPar


    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'zhaobsh',
      password : 'Test6530',
      database : 'dmzj'
    });
    // (?,?,?,?,?,?,?,?,?)
    connection.connect();
    var  sql = `select * from dmzj_abstract limit ${(req.params.id-1)*10}, 10;`;

   connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       searchPar = result;
       res.send(searchPar)
       console.log('------------------------------------------------------------\n\n');  
});

    connection.end();


  })


if(!port){
  console.log('请指定端口号 例如\nnode server.js 8888')
  process.exit(1)
}

let sessions={};
console.log('zzzzzzzzzzzz')
var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var path = request.url 
  var query = ''
  if(path.indexOf('?') >= 0){ query = path.substring(path.indexOf('?')) }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('HTTP 路径为\n' + path) 
if(path == '/'){ //首页
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
      let string = fs.readFileSync('./index.html','utf-8')
      let cookies = '';
      console.log(request.headers.cookie)
      if(request.headers.cookie){
        cookies = request.headers.cookie.split('; ')
      }    
      response.write(string)

    response.end()
  }else if(path === '/CSS/main.css'){ //注册页面
    console.log('xxxxxx')
    let string = fs.readFileSync('./CSS/main.css')
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css; charset=utf-8')
    response.write(string)
    response.end()
  }else{
    response.statusCode = 404
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})
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

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)