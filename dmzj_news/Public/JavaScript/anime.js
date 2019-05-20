//修改
let anime = Vue.component('anime',{
    props:['pagedata','ifcreated'],
    template:`
    <div>
        <div class="left-side">
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
        <ul class="pagination">
          <li>
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li @click="topage" v-for="item3 in pages"><span :data-page="item3">{{item3}}</span></li>
          <li>
            <a href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
    </div>
    `,
    data:function(){
        return {
            //修改
            page:this.pagedata.anime,
            indeximg:[{img:'./Images/66474729_p0.jpg',href:'#',abstract:'ccc',},
                {img:'./Images/8c007b5cgy1fqwefu5tkrj20xc0nkqv5.jpg',href:'#',abstract:'xxx'},
                {img:'./Images/8c007b5cly1fkayrbqu9sj216b0ovke1.jpg',href:'#',abstract:"zzz"}
            ],
            article:[{}],
            pages:[1,2,3,4,5],
        }
    },
    methods:{
        topage:function(e){
            console.log(e.target.getAttribute('data-page'))
            this.$emit('loadpage',{page:'anime',part:'article',num:e.target.getAttribute('data-page')})
            // this.$emit('loadpage',{page:'index',part:'indeximg'})
        }
    },
    created:function(){
        //修改
        if(this.ifcreated.anime === 0){
            //修改
            this.$emit('loadpage',{page:'anime',part:'article',num:1})
        }
    }
})