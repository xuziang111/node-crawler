(function(){
    leftresize()
    $(window).on('scroll',function(){
        let wwidth = $(window).width()
        if(wwidth-1200>0){
            $(".tab-bar").css({'left':`${(wwidth-1120)/2}px`})
        }else{
            $(".tab-bar").css({'left':`${-$(window).scrollLeft()}px`})
        }
    })
    function leftresize(){
        let wwidth = $(window).width()
        if(wwidth-1200>0){
            $(".tab-bar").css({'left':`${(wwidth-1120)/2}px`})
        }else{
            $(".tab-bar").css({'left':'0'})
        }
    }
    $(window).resize(function() {
        leftresize()
      });

    // const article = { template: '<div>bar</div>' }
    const routes = [
        { path: '/', redirect: '/index/1'},
        { path: '/index/:id', component:index},
        { path: '/anime/:id', component: anime },
        { path: '/anime', redirect: '/anime/1' },
        { path: '/article/:id', component: articles},
        { path: '*', component: index },
    ]

    const router = new VueRouter({
        routes // (缩写) 相当于 routes: routes
    })

    const bodyContainer = new Vue({
        el:'#body-container',
        router,
        data:{
            ifcreated:{index:0,anime:0,hot:0},
            pagedatas:{
                //hot {href:'点击文章链接',title:'标题,date:'日期'}
                hot:{hot:[{href:'#',title:'loading...',date:'loading...'}]},
                index:{
                    //{img:'图片地址',href:'点击文章链接',abstract:'介绍文字',}
                    indeximg:[{img:'./Images/66474729_p0.jpg',href:'#',abstract:'ccc',},
                        {img:'./Images/8c007b5cgy1fqwefu5tkrj20xc0nkqv5.jpg',href:'#',abstract:'xxx'},
                        {img:'./Images/8c007b5cly1fkayrbqu9sj216b0ovke1.jpg',href:'#',abstract:"zzz"}
                    ],
                    //{title:'标题',img:'图片地址',abstract:'简介/第一段文字',date:'日期',source:'来源',type:'分类'}
                    article:[],
                },
                anime:{
                    article:[{article:'',title:'',publish_source:'',href:'',publish_date:'',}],
                }
            },
        },
        methods:{
            //index/hot
            //index/indeximg
            //index/article/1
            //anime/article/1
            //......
            ajaxstart:function (e){
                console.log(e)
                let _temp = this
            let path
            // console.log(e.page)
            // console.log(_temp.pagedatas[e.page].num)
            // console.log(_temp.$route.path)    
                let url
                if(e.num){
                    url = `${e.page}/${e.num}`
                    console.log(e)
                }else{
                    url = `${e.page}`
                }
                // let _temp = this
                console.log(url)
                $.ajax({
                    type:'get',
                    url: url,
                    success: function(data){
                        data.forEach(function(e,index){
                            e.img_abstract = `/article/${e.article_id}/abstract.jpg`
                            e.href='/article/' + e.article_id
                        })
                        this.e = e
                        _temp.ajaxsuccess(data,e)
                    },
                    error:function(xxx){
                        let data = [{title:'东京动画奖2019”年度最佳动画作品奖与个人奖结果发表',href:'/article/61098',img:'/Images/66474729_p0.jpg',abstract:'东京动画奖2019（TAAF2019）”的“年度最佳动画部门”作品奖与个人奖结果发表了。',date:'2019-2-21',source:'dmzj',type:'动画'},
                            {title:'《辉夜姬想让人告白》真人电影化决定！桥本环奈饰演辉夜',href:'/article/61087',img:'/Images/66474729_p0.jpg',abstract:'赤坂赤创作的漫画《辉夜姬想让人告白～天才们的恋爱头脑战～》将拍摄真人电影版，白银御行由平野紫耀出演，四宫辉夜由桥本环奈饰演。',date:'2019-2-21',source:'dmzj',type:'杂项'},
                        ]
                        // let data = []
                        this.e = e
                        console.log(e)
                        _temp.ajaxsuccess(data,e)
                    },
                    
                });
            },
            ajaxsuccess:function(data,e){
                console.log(data)
                console.log(e)
                this.ifcreated[e.page]=1
                this.pagedatas[e.page][e.part]=data
                // if(!e.num||e.num===1){
                //     this.pagedatas[e.page][e.part] = data
                //     this.ifcreated[e.page]=1
                // }else{
                //     this.pagedatas[e.page][e.part]=this.pagedatas[e.page][e.part].concat(data)
                //     this.pagedatas[e.page].num++
                // }
            },
        },
        mounted:function(){
            // let _temp = this
            // let path
            // console.log(this.pagedatas.index.num)
            // $(window).on('scroll',function(){
            //     if(_temp.$route.path === '/'){
            //         path = 'index'
            //     }else{
            //         path = _temp.$route.path.slice(1)
            //     }         
            //     if(_temp.isLoading==false){
            //         if($(document).scrollTop()+$(window).height()-($(".article-content").height()+$(".article-content").offset().top)>-200){
            //             console.log(_temp.pagedatas.index)
            //             _temp.isLoading = true
            //             _temp.ajaxstart({page:'index',part:'article',num:_temp.pagedatas[path].num})
            //         }
            //     }   
            // })

            // $(window).on('scroll',function(){
            //     console.log(_temp.$route.path)
            //     // console.log($(".article-content").height())
            //     // console.log($(document).scrollTop()+$(window).height()-($(".article-content").height()+$(".article-content").offset().top))
            //     if(_temp.$route.path === '/'){
            //         path = 'index'
            //     }else{
            //         path = _temp.$route.path.slice(1)
            //     }
            //     if($(document).scrollTop()+$(window).height()-($(".article-content").height()+$(".article-content").offset().top)>-200){
            //         // console.log('xxx')
            //         // console.log(path)
            //         _temp.ajaxstart({page:path,part:'article',num:_temp.pagedatas[path].num})
            //     }
            // })
        }
    }).$mount('#body-container')

})()