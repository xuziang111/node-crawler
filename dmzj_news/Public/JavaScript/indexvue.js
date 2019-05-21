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
                <section class="article" v-for="(item,index) in page.article">
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
          <li>
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          
          <li @click="topage" v-for="(item3,index) in pages"><span :data-page="item3">{{item3}}</span></li>
          <li v-for="(item3,index) in pages"><router-link :to="pagess[index]"><span :data-page="item3">{{item3}}</span></router-link></li>
          <li>
            <a href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
        </nav>
    </div>
    `,
    data:function(){
        return {
            page:this.pagedata.index,
            indeximg:[{img:'./Images/66474729_p0.jpg',href:'#',abstract:'ccc',},
                {img:'./Images/8c007b5cgy1fqwefu5tkrj20xc0nkqv5.jpg',href:'#',abstract:'xxx'},
                {img:'./Images/8c007b5cly1fkayrbqu9sj216b0ovke1.jpg',href:'#',abstract:"zzz"}
                ],
            article:[],
        pages:[1,2,3,4,5],
        pagess:['/index/1','/index/2','/index/3','/index/4','/index/5']
        }
    },
    methods:{
        topage:function(e){
            console.log(e.target.getAttribute('data-page'))
            console.log(e.target)
            this.$emit('loadpage',{page:'index',part:'article',num:e.target.getAttribute('data-page')})
            // this.$emit('loadpage',{page:'index',part:'indeximg'})
        }
    },
    mounted:function(){
        console.log(this.$router)
        // this.$emit('loadpage',{page:'index',part:'article',num:1})
    },
    beforeRouteUpdate (to, from, next) {
        console.log(to.params.id)
        console.log('next')
        this.$emit('loadpage',{page:'index',part:'article',num:to.params.id})
        next()
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
      },
    created:function(){

    }
})