var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('../node_modules/superagent');
const cheerio = require('../node_modules/cheerio');


console.log('xxx')
superagent.get('https://news.dmzj.com/article/61877.html').end((err, res) => {
    let $ = cheerio.load(res.text, { decodeEntities: false });
    console.log(!$('.news_content').text()==='')
    if($('.news_content').text()===''){
    console.log('haha')
    }

})