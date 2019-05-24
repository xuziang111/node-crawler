//修改
let anime = Vue.component('anime',{
    props:['pagedata','ifcreated'],
    template:`
    <div>
        <div class="left-side">
            <div class="partition-name"><h3>推荐文章</h3></div>
            <div class="article-content">
                <section class="article" v-for="(item,anime) in page.article">
                    <router-link :to="item.href">
                        <div class="article-left">
                            <h4 class="article-tittle">{{ item.title }}</h4>
                            <p>{{item.abstract}}</p>
                            <div class="article-inf"><span>{{item.publish_source}}</span><span>{{item.type}}</span><span>{{item.publish_date}}</span></div>
                        </div>
                        <div class="article-right"><img :src="item.img_abstract" width="120" height="90"></div>
                    </router-link>
                </section>               
            </div>
        </div>
        <nav aria-label="Page navigation">
        <ul class="pagination">
          <li :class='isflip.pre'>
            <router-link :to='isflip.prepage' aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </router-link>
          </li>
          
          <li v-for="(item3,index) in pages" :class='isactive[index]'><router-link :to="pagess[index]"><span :data-page="item3">{{item3}}</span></router-link></li>
          <li :class='isflip.next'>
            <router-link :to='isflip.nextpage' aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </router-link>
          </li>
        </ul>
        </nav>
    </div>
    `,
    data:function(){
        return {
            isflip:{
                pre:'disabled',
                next:'disabled',
                prepage:'/anime/1',
                nextpage:'/anime/6'
            },
            isactive:['active','','','',''],
            page:this.pagedata.anime,
            animeimg:[{img:'./Images/66474729_p0.jpg',href:'#',abstract:'ccc',},
                {img:'./Images/8c007b5cgy1fqwefu5tkrj20xc0nkqv5.jpg',href:'#',abstract:'xxx'},
                {img:'./Images/8c007b5cly1fkayrbqu9sj216b0ovke1.jpg',href:'#',abstract:"zzz"}
                ],
            article:[],
        pages:[1,2,3,4,5],
        pagess:['/anime/1','/anime/2','/anime/3','/anime/4','/anime/5']
        }
    },
    methods:{
        creatpage:function(e){
            e = e - 0
            console.log(e)
            if(e==1){
                this.isflip={
                    pre:'disabled',
                next:'',
                prepage:'',
                nextpage:'/anime/6'
                }
                this.isactive=['active','','','','']
                this.pages=[1,2,3,4,5],
                this.pagess=['/anime/1','/anime/2','/anime/3','/anime/4','/anime/5']
                console.log(this.isflip)
            }
            if(e==2){
                this.isflip={
                    pre:'',
                next:'',
                prepage:`/anime/${e-1}`,
                nextpage:`/anime/${e+1}`
                }
                this.isactive=['','active','','','']
                this.pages=[1,2,3,4,5],
                this.pagess=['/anime/1','/anime/2','/anime/3','/anime/4','/anime/5']
            }
            if(e >= 3 ){
                this.isflip={
                    pre:'',
                next:'',
                prepage:`/anime/${e-1}`,
                nextpage:`/anime/${e+1}`
                }
                this.pages=[e-2,e-1,e,e+1,e+2]
                this.isactive=['','','active','','']
                this.pagess=[`/anime/${this.pages[0]}`,`/anime/${this.pages[1]}`,`/anime/${this.pages[2]}`,`/anime/${this.pages[3]}`,`/anime/${this.pages[4]}`]
            }
            // console.log(e.target.getAttribute('data-page'))
            // console.log(e.target)
            // this.$emit('loadpage',{page:'anime',part:'article',num:e.target.getAttribute('data-page')})
        }
    },
    mounted:function(){
    //进入组建时触发
        this.$emit('loadpage',{page:'anime',part:'article',num:this.$route.params.id})
        this.creatpage(this.$route.params.id)
    },
    beforeRouteUpdate (to, from, next) {
        //每次同组件间跳转触发
        this.$emit('loadpage',{page:'anime',part:'article',num:to.params.id})
        this.creatpage(to.params.id)
        next()
      },
    created:function(){

    }
})