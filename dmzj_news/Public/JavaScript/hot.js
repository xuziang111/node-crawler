const hot = Vue.component('hot',{
    props:['pagedata','ifcreated'],
    template:`                    
                    <aside class="right-side">
                        <div>
                            <h4>热点</h4>
                            <hr>
                            <ul>
                                <li v-for="(item,index) in hot">
                                <router-link :to="item.href">{{item.title}}</router-link><span>{{item.time}}</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
`,
    data:function(){
        return{
            page:this.pagedata.hot,
            hot:[]
        }
    },
    created:function(){
        let _temp = this
        $.ajax({
            type:'get',
            url: '/hot',
            success: function(data){
                console.log(data)
                data=JSON.parse(data)
                let temparr=[]
                data.forEach(function(e,index){                    
                    e.href='/article/'+e.href.slice(e.href.lastIndexOf("/")+1,e.href.lastIndexOf("."))
                    console.log(e.href)
                    temparr.push(e)
                })
                _temp.hot = temparr
            },
            error:function(xxx){
                let data = [{title:'东京动画奖2019”年度最佳动画作品奖与个人奖结果发表',href:'/article/61098',img:'/Images/66474729_p0.jpg',abstract:'东京动画奖2019（TAAF2019）”的“年度最佳动画部门”作品奖与个人奖结果发表了。',date:'2019-2-21',source:'dmzj',type:'动画'},
                    {title:'《辉夜姬想让人告白》真人电影化决定！桥本环奈饰演辉夜',href:'/article/61087',img:'/Images/66474729_p0.jpg',abstract:'赤坂赤创作的漫画《辉夜姬想让人告白～天才们的恋爱头脑战～》将拍摄真人电影版，白银御行由平野紫耀出演，四宫辉夜由桥本环奈饰演。',date:'2019-2-21',source:'dmzj',type:'杂项'},
                ]
            },
            
        });
    }
})