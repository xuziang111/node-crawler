var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
// 引入所需要的第三方包
const superagent= require('../node_modules/superagent');
const cheerio = require('../node_modules/cheerio');


console.log(string = JSON.parse(fs.readFileSync(`./article/62512/62512img`,'utf-8')))
string.forEach(element => {
    console.log(element)
});
