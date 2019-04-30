let index = Vue.component('index',{
    props:['pagedata','ifcreated'],
    template:`
    <div>
        <div class="left-side">
            <div>
                <div class="block" id="top-carousel">
                    <el-carousel height="210px" arrow="never">
                        <el-carousel-item v-for="(item,index) in page.indeximg" :key="index">
                            <a :href="item.href"><img :src="item.img" alt="..."></a>
                            <h3>{{ item.abstract }}</h3>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            
            <div class="partition-name"><h3>推荐文章</h3></div>
            <div class="article-content">
                <section class="article" v-for="(item,index) in article">
                <router-link :to="item.href">
                <div class="article-left">
                    <h4 class="article-tittle">xxx</h4>
                    <p>{{item.abstract}}</p>
                    <div class="article-inf"><span>{{item.publish_source}}</span><span>{{item.type}}</span><span>{{item.publish_date}}</span></div>
                </div>
                <div class="article-right"><img :src='item.img_abstract' width="120" height="90"></div>
                </router-link>
                </section>               
            </div>
        </div>
        <!--<aside class="right-side">-->
            <!--<div>-->
            <!--<h4>热点</h4>-->
            <!--<hr>-->
            <!--<ul>-->
                <!--<li v-for="(item,index) in hot">-->
                    <!--<a :href="item.href">{{item.title}}</a><span>{{item.date}}</span>-->
                <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
        <!--</aside>-->
    </div>
    `,
    data:function(){
        return {
            isLoading:false,
            page:{
                page:'index',
                num:'1',
                article:[]
            },
            indeximg:[{img:'./Images/66474729_p0.jpg',href:'#',abstract:'ccc',},
                {img:'./Images/8c007b5cgy1fqwefu5tkrj20xc0nkqv5.jpg',href:'#',abstract:'xxx'},
                {img:'./Images/8c007b5cly1fkayrbqu9sj216b0ovke1.jpg',href:'#',abstract:"zzz"}
                ],
            article:[],
            hot:[{href:'#',title:'东京动画奖2019”年度最佳动画作品奖与个人奖结果发表',date:'2019-2-21'}]
        }
    },
    methods:{
        ajaxstart:function(e){
            let url=`${e.page}/${e.part}/${e.num}`
            let _temp = this
                $.ajax({
                    type:'get',
                    url: url,
                    success: function(data){
                        console.log(data)
                        data.forEach(function(e,index){
                            e.img_abstract = `/article/${e.article_id}/abstract.jpg`
                            console.log(e.img_abstract)
                        })
                        this.e = e
                        _temp.ajaxsuccess(data,e)
                        _temp.isLoading = false
                    },
                    error:function(xxx){
                        let data = [{title:'东京动画奖2019”年度最佳动画作品奖与个人奖结果发表',href:'/article/61098',img:'/Images/66474729_p0.jpg',abstract:'东京动画奖2019（TAAF2019）”的“年度最佳动画部门”作品奖与个人奖结果发表了。',date:'2019-2-21',source:'dmzj',type:'动画'},
                            {title:'《辉夜姬想让人告白》真人电影化决定！桥本环奈饰演辉夜',href:'/article/61087',img:'/Images/66474729_p0.jpg',abstract:'赤坂赤创作的漫画《辉夜姬想让人告白～天才们的恋爱头脑战～》将拍摄真人电影版，白银御行由平野紫耀出演，四宫辉夜由桥本环奈饰演。',date:'2019-2-21',source:'dmzj',type:'杂项'},
                        ]
                        // let data = []
                        this.e = e
                        console.log(e)
                        _temp.ajaxsuccess(data,e)
                        _temp.isLoading = false
                    },
                    complete:function(){
                        console.log('xxx')
                        _temp.isLoading = false
                        console.log(_temp.isLoading)
                    }
                });
        },
        ajaxsuccess:function(data,e){
            this.article = this.article.concat(data)
        },
    },
    mounted:function(){
        let _temp = this
        let path
        $(window).on('scroll',function(){
            console.log(_temp.isLoading)         
            if(_temp.isLoading==false){
                _temp.isLoading = true
                if($(document).scrollTop()+$(window).height()-($(".article-content").height()+$(".article-content").offset().top)>-200){
                    // console.log('xxx')
                    // console.log(path)
                    _temp.ajaxstart({page:'index',part:'article',num:_temp.page.num})
                }
            }   
        })
    },
})