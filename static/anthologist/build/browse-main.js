define("utils/ignore-articles",[],function(){var e;return e=function(e){return e.match(/^the /i)?e.substring(4):e.match(/^an /i)?e.substring(3):e.match(/^a /i)?e.substring(2):e}}),define("models/tag-set",["backbone","utils/ignore-articles"],function(e,t){var a;return a=e.Collection.extend({comparator:function(e){var a,s;return a=e.get("last_name")||"",s=a?a:e.get("name"),t(s.toLowerCase())}})}),require.config({paths:{jade:"/static/anthologist/scripts/lib/jade-runtime"},shim:{jade:{exports:"jade"}}}),define("templates/pgSelectTempl",["jade"],function(jade){function pgSelectTempl(locals,attrs,escape,rethrow,merge){attrs=attrs||jade.attrs,escape=escape||jade.escape,rethrow=rethrow||jade.rethrow,merge=merge||jade.merge;var buf=[];with(locals||{}){var interp;buf.push('\n<div class="page-select-arrow u-left">&lt;</div>\n<div class="page-select-arrow u-right">&gt;</div>\n<label for="page-select" class="page-select-label">-- select a page --</label>\n<select id="page-select">\n  <option value="all">all '+escape(null==(interp=itemCount)?"":interp)+" "+escape(null==(interp=dataType)?"":interp)+"</option>"),function(){if("number"==typeof pages.length)for(var e=0,t=pages.length;t>e;e++){var a=pages[e];buf.push("\n  <option"),buf.push(attrs({value:""+a.num+a.sel},{value:!0})),buf.push(">"+escape(null==(interp=a.num)?"":interp)+". "+escape(null==(interp=a.fill)?"":interp)+"</option>")}else{var t=0;for(var e in pages){t++;var a=pages[e];buf.push("\n  <option"),buf.push(attrs({value:""+a.num+a.sel},{value:!0})),buf.push(">"+escape(null==(interp=a.num)?"":interp)+". "+escape(null==(interp=a.fill)?"":interp)+"</option>")}}}.call(this),buf.push("\n</select>")}return buf.join("")}return pgSelectTempl}),define("views/pg-select-view",["backbone","templates/pgSelectTempl"],function(e,t){var a;return a=e.View.extend({template:t,initialize:function(e){return _.extend(this,e),this.render()},getModelDisplay:function(e){if("selections"!==this.dataType)return"authors"===this.dataType?e.get("last_name").toUpperCase():e.get("name").toUpperCase();switch(this.sortField){case"date_entered":return e.get("date_entered_simple");case"author":return e.get("source").author.last_name.toUpperCase();case"pub_year":return e.get("source").date_display}},events:{change:"changePage","click .page-select-arrow":"flipPage"},changePage:function(){var e,t,a,s;return this.router?(t=$("#page-select").val(),this.sorted?(a=$("#sort-field").val(),e=$("#sort-direction").val(),s="page/"+a+e+"/"+t,this.router.navigate(s,{trigger:!0})):this.router.navigate("page/"+t,{trigger:!0}),this.changeSelectedPage()):console.log("No router found.")},changeSelectedPage:function(){return $("#selected-page").html($("#page-select option:selected").text())},flipPage:function(){var e,t,a,s,n,r;return e=$(event.target),s=e.hasClass("u-left")?"prev":"next",t=$("#page-select"),r=t.val(),"all"===r?n="prev"===s?this.pgParams.length:1:(a=parseInt(t.val()),n=e.hasClass("u-left")?a-1:a+1),t.val(n.toString()).trigger("change")},render:function(){var e,t,a,s,n,r,i,l,u,o,h,p;if(n=this.pgParams){for(e=this.container||$("#page-select-container"),i=n.length,s=n[i-1].endIndex+1,e.off().empty(),o={itemCount:s,dataType:this.dataType,pages:[]},a=h=0,p=n.length;p>h;a=++h)r=n[a],u=this.getModelDisplay(r.startModel),t=this.getModelDisplay(r.endModel),l={sel:1===this.startPage&&0===a?" selected":"",fill:u!==t?""+u+" to "+t:u,num:a+1},o.pages.push(l);this.$el.append(this.template(o)),e.append(this.el),this.changeSelectedPage()}else console.log("No page details found.");return this}})}),define("views/paginated-collection-view",["backbone"],function(e){var t;return t=e.View.extend({initialize:function(e){return _.extend(this,e),this.render()},render:function(){var e=this;return this.collection&&this.page?this.container.fadeOut("fast",function(){var t,a,s,n,r,i;for(e.container.off().empty(),"all"===e.page?(n=0,t=e.collection.length-1):(r=e.pgParams[e.page-1],n=r.startIndex,t=r.endIndex),a=i=n;t>=n?t>=i:i>=t;a=t>=n?++i:--i)s=new e.View({model:e.collection.models[a],index:a});return e.container.fadeIn("fast",function(){return e.callback?e.callback():void 0})}):console.log("Missing options: requires 'collection' and 'page'."),this}})}),define("views/br-tag-view",["backbone","views/paginated-collection-view"],function(e,t){var a,s;return a=e.View.extend({tagName:"li",initialize:function(){return this.render()},render:function(){var e,t,a,s;return t=this.model,a=t.get("name"),s=t.get("slug"),e="<a href='"+s+"' class='tag-list--a'><span class='tag-list--span'>"+a+"</span></a>",this.$el.append(e),$("#tag-list").append(this.el),this}}),s=function(e){return new t({collection:e.collection,page:e.page,container:e.container,pgParams:e.pgParams,View:a})}}),define("utils/globals",[],function(){var e;return e={},{getGlobals:function(){return e}}}),define("routers/br-tag-router",["backbone","utils/globals"],function(e,t){var a;return t=t.getGlobals(),a=e.Router.extend({initialize:function(t){return _.extend(this,t),e.history.start({silent:!0})},routes:{"page/:page":"changePage"},changePage:function(e){var a;return a=$("#page-select"),a.val()!==e&&a.val(e),t.app.pageChanger(e)}})}),define("utils/pagination-details",[],function(){var e;return e=function(e,t){var a,s,n,r,i,l,u,o;for(r=e.models,s=e.length,i=Math.ceil(s/t),l=[],a=function(){var e,a,i;return i=n*t,a=(n+1)*t-1,e=s-1,a>e&&(a=e),l[n]={startIndex:i,startModel:r[i],endIndex:a,endModel:r[a]}},n=u=0,o=i-1;o>=0?o>=u:u>=o;n=o>=0?++u:--u)a(n);return{startEndModels:l,pgCount:i}}}),define("apps/browse-app",["backbone","models/tag-set","views/pg-select-view","views/br-tag-view","routers/br-tag-router","utils/pagination-details","utils/globals"],function(e,t,a,s,n,r,i){var l;return i=i.getGlobals(),l=e.View.extend({settings:{itemsPerPage:10,container:$("#tag-list"),dataType:tagType,startPage:"all"},initialize:function(){return this.getTags()},getTags:function(){var e,a=this;return e=this.tagSet=new t,e.url="/api/"+this.settings.dataType,e.fetch({error:function(){return console.log("The tag set couldn't be fetched.")},success:function(){return a.setPagination(),a.pgCount>1?(a.router=new n({pageChanger:a.pageChanger}),a.router.navigate("page/all",{replace:!0}),a.getPageSelect()):void 0}})},setPagination:function(){var e;return e=r(this.tagSet,this.settings.itemsPerPage),this.pgParams=e.startEndModels,this.pgCount=e.pgCount},getPageSelect:function(){var e;return e=new a({pgParams:this.pgParams,router:this.router,dataType:this.settings.dataType,startPage:this.settings.startPage})},pageChanger:function(e){var t;return t={collection:this.tagSet,page:e,pgParams:this.pgParams,container:this.settings.container},s(t)}})}),function(){require(["apps/rand-quot-app","apps/browse-app","utils/globals"],function(e,t,a){var s,n;return n=new e,a=a.getGlobals(),s=a.app=new t})}.call(this),define("browse-main",function(){});