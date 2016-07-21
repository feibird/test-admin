(function(){
"use strict"
angular
    .module("index_area",["ui.router",'LocalStorageModule','ui.bootstrap','ngTable'])
    .constant("device","pc")			//定义全局变量:设备编号
    .constant("version","1.0.0")		//定义全局变量:版本号
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/stores/list");
        $stateProvider
           .state("/sort/list", {											//分类管理
                url: "/sort/list",
                templateUrl: "Sort/list.html",
                 controller: 'SortlistCtrl as SortlistCtrl',
                 params: {'index':3}
         }).state("/supplierlogo/list", {									//供应商品牌
                url: "/supplierlogo/list",
                templateUrl: "Supplierlogo/list.html",
                 controller: 'SupplierLogolistCtrl as SupplierLogolistCtrl',
                 params: {'index':5}
         }).state("/brandstores/list", {									//连锁品牌
                url: "/brandstores/list",
                templateUrl: "BrandStores/list.html",
                controller: 'BrandStoreslistCtrl as BrandStoreslistCtrl',
                params: {'index':5}
         })
          //去掉#号  
        /*$locationProvider.html5Mode(true);*/
    })
    .config(httpConfig)
    .run(run);

httpConfig.$inject = ['$httpProvider']
function httpConfig($httpProvider) {
    //http拦截器拦截非401状态码的错误请求，err_msg
    $httpProvider.interceptors.push(['$q',
        function($q) {
            return {
                responseError: function(rejection) {
                    if (rejection.status != 401) {
                       /* layer.open({
                            content: rejection.data.err_msg,
                            style: 'background-color:#333847; color:#fff; border:none;',
                            time: 1.5
                        });*/

                    }
                    return $q.reject(rejection);
                }
            }
        }])
}

run.$inject = ['$rootScope', '$state', '$location', 'localStorageService']
function run($rootScope, $state, $location, localStorageService) {
  
}

})();
(function(){
"use strict"
angular.module('index_area').controller('BrandStoreslistCtrl',BrandStoreslistCtrl);
BrandStoreslistCtrl.$inject = ['$state','$scope','$rootScope','NgTableParams','PublicResource','BrandStoresResourrce','SortResource','$stateParams'];
/***调用接口***/
function BrandStoreslistCtrl($state,$scope,$rootScope,NgTableParams,PublicResource,BrandStoresResourrce,SortResource,$stateParams) {
    document.title ="连锁品牌管理";
	$rootScope.name="连锁品牌管理";
	$rootScope.childrenName="连锁品牌管理列表";
    var vm = this;
	vm.seid
    vm.pagecount;															//分页总数
    vm.pageint=1;															//当前分页导航
    vm.skip=0																//从第几个开始
    vm.limit=12;															//从第几个结束
	vm.addinfo;																//添加数据对象
	vm.list;																//数据列表集合
	vm.sortlist;															//分类列表集合
	vm.seletedId;															
	vm.updateinfo;															//修改数据对象
    vm.pageChanged = function(){       
       vm.skip = (vm.pageint-1)*12;
       vm.limit = vm.skip+12;
       info_list(vm.seid);
    }
    
    //获取页面坐标
    vm.index=$stateParams.index;    
    PublicResource.navclass(vm.index)
    /**
     * 删除
     */
    vm.delinfo = function(id){
    	console.log(id)
    	layer.confirm('您确定要删除品牌？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			BrandStoresResourrce.removelist(id,vm.seid).then(function(data){
				console.log(data);
				if (data.data.status=="OK") {					
					layer.alert('删除成功~',{icon: 1});					
				} else{
					layer.alert(data.data.message.data,{icon: 0});
				}
				info_list(vm.seid);
			})
		  
		});
    }
	
	//获取sessionId
	login();
	sortlist();
	function login(){
		vm.user=PublicResource.seid("admin");			
		if(typeof(vm.user)=="undefined"){
			layer.alert("尚未登录！",{icon:2},function(index){
				layer.close(index);
				PublicResource.Urllogin();
			})
		}else{
			vm.seid = PublicResource.seid(vm.user);
		}
	}	
    
     //当前用户状态
   /* PublicResource.verification(vm.seid).then(function(data){
    	console.log(data)
    })*/
    
    //查询分类列表
   info_list(vm.seid);
    
    //开启模态框
	vm.openmask = function(index){		
			$scope.$apply();
			
		/*console.log(index);
		vm.addinfo.id=index;*/
		layer.open({
		  type: 1,
		  title:false,
		  area: ['440px', '515px'], //宽高
		  content:$(".info_add")
		});
		SortResource.list(vm.seid).then(function(data){
			vm.sortlist = data.data.result.root
			console.log(vm.sortlist)
		})
	}
	
	//关闭弹出层
	vm.closechildren = function(){		
		layer.closeAll();
	}
	
	//新增子类
	vm.childrenbtn = function(has){		
		BrandStoresResourrce.addlist(vm.addinfo,vm.seid).then(function(data){			
			console.log(data.status)
			if(data.data.status=="OK"){				
				if(!has){
					layer.closeAll();
				}
				layer.msg("添加成功~");
				info_list(vm.seid);
			}
		})
	}
	
	//获取单个数据
	vm.updateinfo = function(list){
		vm.updateinfo = list;
		layer.open({
		  type: 1,
		  title:false,
		  area: ['440px', '515px'], //宽高
		  content:$(".info_update")
		});

	}
	
	
	/**
	 * 连锁品牌集合
	 * @param {Object} seid
	 */
	function info_list(){
		 BrandStoresResourrce.list(vm.seid,vm.skip,vm.limit).then(function(data){
	    	vm.list=data.data.result;
			vm.tableParams = new NgTableParams({},{dataset:vm.list.data});
	    	vm.pagecount = data.data.result.total
	    	console.log(data)
	    })
	}

	function sortlist(){
		SortResource.list(vm.seid).then(function(data){
		 vm.sortlist = data.data.result.root
		 console.log(vm.sortlist)
		 })
	}

	/**
	 *图片上传
	 */
	$('.loadBtn').on('click', function() {
		var imgobj = ("upload",$(".Uploadinput").get(0).files[0]);
		PublicResource.imgUpload(vm.seid,imgobj).then(function(data){			
			if(data.status=="OK"){
				console.log(data)
				layer.alert("上传成功~",{icon:1});
				$("#upform .uploadimg").attr("src",data.result);
				vm.addinfo.imgUrl= data.result;
			}else{
				layer.msg('删除异常，请联系管理员~',{icon: 0});
			}
		})
	});


	vm.addlist = function(){		
		BrandStoresResourrce.addlist(vm.addinfo,vm.seid).then(function(data){
			console.log(data)
			if (data.data.status=="OK") {
				layer.alert("上传成功~",{icon:1},function(){
					layer.closeAll();
				});
				info_list(vm.seid);
			}else{
				layer.alert(data.message,{icon:0});
			}
		})
	}

	//修改数据
	vm.upinfo = function(){		
		console.log(vm.updateinfo)
		BrandStoresResourrce.updateinfo(vm.updateinfo,vm.seid).then(function(data){
			if (data.data.status=="OK") {
				layer.msg("修改成功~",{icon:1},function(){
					layer.closeAll();
				});
				info_list(vm.seid);
			}else{
				layer.msg("修改异常~请联系程序员",{icon:0});
			}
		})
	}
}

})();
(function(){
"use strict"
/**
 * 连锁品牌管理功能API封装
 */
angular.module('index_area').factory('BrandStoresResourrce', BrandStoresResourrce);
BrandStoresResourrce.$inject = ['$http','device','version'];
function BrandStoresResourrce($http,device,version) {
    return {
        list:list,
        addlist:addlist,
        removelist:removelist,
        getlist:getlist,
        updateinfo:updateinfo
    };
    
	/**
	 * list
	 * 获取列表
	 */
    function list(seid,skip,limit){    	

        /*return $.ajax({
        	type:"get",
        	url:"/api-admin/brand/list",
        	async:false,
        	dataType:"json",
        	data:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit},
        	success:function(response){
        		return response.data;
        	}
        });*/
        return $http.get("/api-admin/brand/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
            return data
        })
    }    
    
    /**
     * 添加分类
     */
    function addlist(obj,seid){  
    /*console.log(obj)  	
    	return $.ajax({            
    		type:"post",
    		url:"/api-admin/brand/add",
    		async:false,
    		dataType:"json",
    		data:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "name":obj.name,
                "category.id":obj.category.data.id,
                "logo":obj.imgUrl,
                "sort":obj.sort,
                "serialPrefix":obj.serialPrefix},
    		success:function(response){
    			return response.data;
    		}
    	});*/
        return $http({
            url:"/api-admin/brand/add",
            method: 'post',
            params:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "name":obj.name,
                "category.id":obj.category.data.id,
                "logo":obj.imgUrl,
                "sort":obj.sort,
                "serialPrefix":obj.serialPrefix}
        })
        .then(function (data) {
             return data
        })
    }
    
    /**
     * 删除分类
     */
    function removelist(id,seid){
    	/*return $.ajax({
    		type:"post",
    		url:"/api-admin/brand/"+id+"/remove",
    		dataType:"json",
    		data:{"device":device,"version":version,"sessionId":seid,"id":id},
    		async:false,    		
    		success:function(response){
    			return response.data;
    		}
    	});*/
        return $http({
            url:"/api-admin/brand/"+id+"/remove",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"id":id}
        })
        .then(function (data) {
             return data
        })
    }
    
    
    
    /**
     * 获取某个分类
     */
    function getlist(id,seid){    	     	
    	/*return $.ajax({
            type:"get",
            url:"/api-admin/brand/"+id+"/get",
            dataType:"json",
            data:{"device":device,"version":version,"sessionId":seid,"id":id},
            async:false,            
            success:function(response){
                return response.data;
            }
        });*/
         return $http.get("/api-admin/brand/"+id+"/get",{params:{"device":device,"version":version,"sessionId":seid,"id":id}}).then(function(data){
            return data
        })
        
    }
   

     /**
     * 修改分类
     */
    function updateinfo(obj,seid){        
       /* return $.ajax({
            type:"post",
            url:"/api-admin/brand/"+obj.id+"/update",
            dataType:"json",
            data:{"device":device,"version":version,"sessionId":seid,"name":obj.name,"category.id":obj.category.data.id,"logo":obj.imgUrl,"sort":obj.sort},
            async:false,            
            success:function(response){
                return response.data;
            }
        });*/
         return $http({
            url:"/api-admin/brand/"+obj.id+"/update",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"name":obj.name,"category.id":obj.category.data.id,"logo":obj.imgUrl,"sort":obj.sort}
        })
        .then(function (data) {
             return data
        })
    }

}
})();
(function(){
"use strict"

})();
(function(){
"use strict"

})();
(function(){
"use strict"

})();
(function(){
"use strict"
angular.module('index_area').controller('SupplierLogolistCtrl',SupplierLogolistCtrl);
SupplierLogolistCtrl.$inject = ['$scope','$state','$rootScope','NgTableParams','PublicResource','$stateParams','SupplierLogoResourrce','SortResource'];
/***调用接口***/
function SupplierLogolistCtrl($scope,$state,$rootScope,NgTableParams,PublicResource,$stateParams,SupplierLogoResourrce,SortResource) {
    document.title ="供应商品牌";
    $rootScope.name="供应商品牌";
    $rootScope.childrenName="供应商品牌列表";
    var vm = this;
    vm.seid;
    vm.pagecount;
    vm.pageint=1;
    vm.skip=0;             //起始数据下标
    vm.limit=12;            //最大数据下标
    vm.list;
    vm.sortlist;             //分类集合
    vm.infolist;            //数据集合；  
    vm.if_status;  
    //获取页面坐标
    vm.index=$stateParams.index;    
    PublicResource.navclass(vm.index)
    login();
    /**
     * [opermask 开启遮罩层]
     * @param  {[type]} index [true as false 判断是修改还是新增]
     * @param  {[type]} id    [description]
     * @return {[type]}       [description]
     */
    vm.opermask = function(id){        
        sortlist();             //查询分类集合
        if(id=="yes"){
            vm.infolist=null;
            vm.if_status=0;
        }else{
            vm.if_status=1;
            infoget(id)             //查询品牌数据
        }
        layer.open({
          type: 1,
          title:false,
          area: ['440px', 'auto'], //宽高
          content:$(".info_div")
        });            
    }
    
    vm.opengood = function(id){
    	infoget(id); 
    	layer.open({
          type: 1,
          title:"商品信息",
          area: ['440px',"500px"], //宽高
          content:$(".getgood")
        }); 
    }

    /**
     * [upinfo 模态框按钮]
     * @return {[type]} [description]
     */
    vm.upinfo = function(){
        if(vm.if_status==1){
            updateinfo();
        }else{
            Addinfo();
        }
    }

    vm.delopen = function(id){
        console.log(id)
        layer.confirm('您确定要删除数据？', {
              btn: ['确定','取消'] //按钮
        }, function(){
            removeinfo(id);
        });
    }
      

     //查询分类列表
    info_list(vm.seid,vm.skip,vm.limit);

    
    function login(){
		vm.user=PublicResource.seid("admin");			
		if(typeof(vm.user)=="undefined"){
			layer.alert("尚未登录！",{icon:2},function(index){
				layer.close(index);
				PublicResource.Urllogin();
			})
		}else{
			vm.seid = PublicResource.seid(vm.user);
		}
	}
    

    /**
     * 供应商品牌集合
     * @param {Object} seid
     */
    function info_list(){
         SupplierLogoResourrce.list(vm.seid,vm.skip,vm.limit).then(function(data){            
             vm.list=data.data.result.data;
            vm.tableParams = new NgTableParams({},{dataset:vm.list});                      
            vm.pagecount = data.data.result.total;
            console.log(vm.list)
        })
    }

    /**
     * [updateinfo 修改数据]
     * @return {[type]} [description]
     */
    function updateinfo(){
        SupplierLogoResourrce.updateinfo(vm.seid,vm.infolist).then(function(data){
            if(data.status=="OK"){
                info_list(vm.seid,vm.skip,vm.limit);
                layer.msg("修改成功~",{icon:1},function(){
                     layer.closeAll();                    
                });                
            }else{
                layer.msg("修改失败~，请联系程序猿~",{icon:0});
            }
        })
    }

    /**
     * [infoget 查询单个品牌数据]
     * @param  {[type]} id [品牌ID]
     * @return {[type]}    [description]
     */
    function infoget(id){
        SupplierLogoResourrce.infoget(vm.seid,id).then(function(data){
            vm.infolist = data.result;
            console.log(vm.infolist)
        })
    }

    /**
     * [sortlist 品牌分类集合]
     * @return {[type]} [description]
     */
    function sortlist(){
        SortResource.list(vm.seid).then(function(data){
            vm.sortlist = data.data.result.root
        })
    }

    /**
     * [addinfo 新增供应商品牌]
     * @return {[type]} [description]
     */
    function Addinfo(){        
        SupplierLogoResourrce.addlist(vm.seid,vm.infolist).then(function(data){
             if(data.status=="OK"){
                layer.msg("保存成功~",{icon:1},function(){
                    layer.closeAll();
                     //查询分类列表
                    info_list(vm.seid,vm.skip,vm.limit);
                });                            
            }else{
                layer.msg('保存异常，请联系管理员~', {icon: 0});
            }
        })
    }

    /**
     *图片上传
     */
    $('.loadBtn').on('click', function() {
        var _this = $(this);
        var imgobj = ("upload",$(".Uploadinput").get(0).files[0]);        
        PublicResource.imgUpload(vm.seid,imgobj).then(function(data){            
            if(data.status=="OK"){
                layer.msg("上传成功~",{icon:1},function(){                    
                    vm.infolist.logo=data.result;
                     info_list(vm.seid,vm.skip,vm.limit);
                });            
            }else{
                layer.msg('上传异常，请联系管理员~', {icon: 0});
            }
        })
    });
    

    function removeinfo(id){
       SupplierLogoResourrce.dellist(vm.seid,id).then(function(data){
             if(data.status=="OK"){
                layer.msg("删除成功~",{icon:1},function(){
                    layer.closeAll();
                     //查询分类列表
                    info_list(vm.seid,vm.skip,vm.limit);
                });                            
            }else{
                layer.msg('删除异常，请联系管理员~', {icon: 0});
            }
        }) 
    }

}

})();
(function(){
"use strict"
angular.module('index_area').factory('SupplierLogoResourrce',SupplierLogoResourrce);
SupplierLogoResourrce.$inject = ['$http','device','version'];
function SupplierLogoResourrce($http,device,version) {
    return {
		list:list,
		infoget:infoget,
		addlist:addlist,
		updateinfo:updateinfo,
		dellist:dellist
    };
    
	
	/**
	 * 基础商品列表	 
	 */
	function list(seid,skip,limit){		
		return $http.get("/api-admin/provider/brand/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
			return data
		})
	}

	/**
	 * [infoget 获取单个数据]
	 * @param  {[type]} seid [sessionID]
	 * @param  {[type]} id   [数据ID]
	 * @return {[type]}      [description]
	 */
	function infoget(seid,id){		
		return $.ajax({
				type:"get",
				url:"/api-admin/provider/brand/"+id+"/get",
				async:false,
				data:{"device":device,"version":version,"sessionId":seid,"id":id},
				dataType:"json",
				success:function(response){
					return response.data;
				}
		});
	}
	
	/**
	 * 添加基础商品
	 */
	function addlist(seid,obj){
		return $.ajax({
				type:"get",
				url:"/api-admin/provider/brand/add",
				async:false,
				data:{
					"device":device,
					"version":version,
					"sessionId":seid,
					"name":obj.name,
					"category.id":obj.category.data.id,
					"logo":obj.logo,
					"sort":obj.sort,
					"serialPrefix":obj.serialPrefix
				},
				dataType:"json",
				success:function(response){
					return response.data;
				}
		});
	}
	
	/**
	 * 修改商品
	 */
	function updateinfo(seid,obj){
		
		return $.ajax({
				type:"post",
				url:"/api-admin/provider/brand/"+obj.id+"/update",
				async:false,
				data:{
					"device":device,
					"version":version,
					"sessionId":seid,
					"name":obj.name,
					"category.id":obj.category.data.id,
					"logo":obj.logo,
					"sort":obj.sort,
					"serialPrefix":obj.serialPrefix
				},
				dataType:"json",
				success:function(response){
					return response.data;
				}
		});
	}
	
	/**
	 * 删除商品
	 */
	function dellist(seid,id){
		return $.ajax({
			type:"post",
			url:"/api-admin/provider/brand/"+id+"/remove",
			async:false,
			data:{"device":device,"version":version,"sessionId":seid},
			dataType:"json",
			success:function(response){
				return response.data;
			}
		});
	}
}
})();
(function(){
"use strict"
angular.module('index_area').factory('PublicResource', PublicResource);
PublicResource.$inject = ['$http','device','version'];
function PublicResource($http,device,version) {
    return {
        seid:seid,
        verification:verification,
        Urllogin:Urllogin,
        navclass:navclass,
		imgUpload:imgUpload,
		getarea:getarea
    };
    
    
    /**
     *获取sessionID 
     * @param {Object} user
     * 登录用户名
     */
	function seid(user){		
		return $.session.get(user);		
	}
	
	
	/**
	 * 验证sessID是否可用
	 * seid:当前sessionID
	 */
	function verification(seid){
	return $.ajax({
			type:"get",
			url:"/api-admin/session/get-user-info",
			async:false,
			data:{"sessionId":seid,"device":device,"version":version},
			dataType:"json",
			success:function(data){
				return data
			}
		});
	}
	
	
	/**
	 * 跳转到登录页
	 */
	function Urllogin(){
		window.location.href="../User/login.html";
	}
	

	

	/**
	 * 图片上传
	 */
	function imgUpload(seid,img){		
		console.log(img)
		var fd = new FormData();
		fd.append("device",device);
		fd.append("version",version);
		fd.append("sessionId",seid);
		fd.append("upload",img);
		return $.ajax({
			type:"post",
			url:"/api-admin/attach/upload",
			async:false,
			processData: false,
			contentType: false,
			data:fd,
			dataType:"json",
			success:function(data){
				return data;
			}
		})
	}
	
	/**
	 * 地区查询
	 */
	function getarea(seid,id){
		return $.ajax({
			type:"get",
			url:"/api-admin/area/list-by-parentId",
			async:false,	
			data:{"sessionId":seid,"device":device,"version":version,"parentId":id},
			dataType:"json",
			success:function(data){
				return data;
			}
		})
	}

	function navclass(index){		
		$(".navdiv").eq(index-1).find(".navdiv-span").addClass("nav-activer");
	}
}
})();
(function(){
"use strict"
angular.module('index_area').controller('SortlistCtrl',SortlistCtrl);
SortlistCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource',"$stateParams"];
/***调用接口***/
function SortlistCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams) {
    document.title ="分类管理";
	$rootScope.name="分类管理";
	$rootScope.childrenName="分类管理列表";
    var vm = this;
	vm.seid
    vm.pagecount=60;
    vm.pageint=5;
    vm.list;						//对象集合
    vm.addinfo= new Object;			//新增分类对象
    vm.sea_info;					//搜索分类
    vm.updatename;					//修改名字
    vm.updateid;					//修改id
    vm.info_address;
    vm.show;
    //获取页面坐标
    vm.index=$stateParams.index;    
    PublicResource.navclass(vm.index)
    
    //分页点击事件
    vm.pageChanged = function(){
        PublicResource.Urllogin();
    }
    //获取sessionId
   	login()
	function login(){
		vm.user=PublicResource.seid("admin");			
		if(typeof(vm.user)=="undefined"){
			layer.alert("尚未登录！",{icon:2},function(index){
				layer.close(index);
				PublicResource.Urllogin();
			})
		}else{
			vm.seid = PublicResource.seid(vm.user);
		}
	}
    //当前用户状态
    PublicResource.verification(vm.seid).then(function(data){
    	console.log(data)
    })
    
    //查询分类列表
   info_list(vm.seid);
    
    //新增子类框
	vm.openmask = function(size){				
		var modalInstance =open({			
			templateUrl:'public/modal.html',
			controller: 'ModalCtrl'			
		})
	}
	
	//关闭弹出层
	vm.closechildren = function(){		
		layer.closeAll();
	}
	
	//新增子类
	vm.childrenbtn = function(has){
		console.log(has )
		SortResource.addlist(vm.addinfo,vm.seid).then(function(data){			
			console.log(data)
			if(data.data.status=="OK"){				
				if(!has){
					layer.closeAll();
				}
				layer.alert("添加成功~",{icon:1});
				info_list(vm.seid);
			}else{
				layer.alert(data.data.message,{icon:2})
			}
		})
	}
	
	vm.updatebtn = function(){
		updatechildren(vm.updateid,vm.updatename);
	}
	
	//删除节点
	vm.delchilren = function(id){
		layer.confirm('您确定要删除分类？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			SortResource.removelist(id,vm.seid).then(function(data){				
				if (data.data.status=="OK") {					
					layer.alert('删除成功~', {icon: 1});
					info_list(vm.seid);
				} else{
					layer.alert(data.data.message,{icon:2})
				}
				
			})
		  
		});
	}
	
	vm.getlist = function(id){
		SortResource.list(vm.seid,id).then(function(data){
	    	vm.list=data.result.root;	    	
	    })
	}
	
	/**
	 * 修改分类
	 * @param {Object} id
	 */
	function updatechildren(id,name){
		 SortResource.updatelist(id,vm.seid,name).then(function(data){	    	
	    	console.log(data);
	    	if(data.data.status=="OK"){				
				layer.closeAll();
				layer.alert("修改成功~");
				info_list(vm.seid);
			}else{
				layer.alert(data.data.message,{icon:2})
			}
	    })
	}
	
	/**
	 * 分类集合
	 * @param {Object} seid
	 */
	function info_list(seid){
		 SortResource.list(vm.seid).then(function(data){
	    	vm.list=data.data.result.root;
	    	for (var item in vm.list.children) {
	    		vm.list.children[item].status=0;
	    	}
	    	console.log(vm.list)
	    })
	}
	
	/**
	 * 搜素分类
	 * sea_list
	 */
	function sea_list(seid,id){
		SortResource.getlist(vm.seid,id).then(function(data){
	    	vm.list=data.result.root;	    	
	    })
	}
	
	/**
	 * 收起分类
	 */
	vm.hidechildren = function(){
		for (var item in vm.list.children) {
			vm.list.children[item].status=1;
		}
	}
	
	/**
	 * 展开分类
	 */
	vm.showchildren = function(item){
		if(!item){
			for (var item in vm.list.children) {
				vm.list.children[item].status=0;
			}
		}
	}
	
	/**
	 * 搜索分类
	 */
	vm.searchSort = function(){
		console.log(vm.sea_info);
		if(typeof(vm.sea_info)=="undefined"){
			layer.msg("分类不可为空",{icon:2})
			return false;
		}
		for(var i = 0;i<vm.list.children.length;i++){
			if(vm.list.children[i].data.name!=vm.sea_info){
				vm.list.children.splice(i,1);
				i--;
			}
		}
		if(vm.list.children.length==0){
			layer.msg("没有相关分类",{icon:2})
			info_list(vm.seid);
		}		
	}
	vm.children = function(num){			
		if(num.status==0){			
			num.status=1;			
			console.log(num);
		}else{			
			num.status=0;
		}		
	}
}
})();
(function(){
"use strict"
/**
 * 分类功能API封装
 */
angular.module('index_area').factory('SortResource', SortResource);
SortResource.$inject = ['$http','device','version'];
function SortResource($http,device,version) {
    return {
        list:list,
        addlist:addlist,
        removelist:removelist,
        getlist:getlist,
        updatelist:updatelist
    };
    
	/**
	 * list
	 * 获取分类列表
	 */
    function list(seid){
		return $http.get("/api-admin/category/list-all",{params:{device:device,version:version,sessionId:seid}}).then(function(data){
			return data
		})
    }
    
    /**
     * 添加分类
     */
    function addlist(obj,seid){    	     
        return $http({
            url:"/api-admin/category/add",
            method: 'post',
            params:{"name":obj.name,"targetId":obj.id,"device":device,"version":version,"sessionId":seid,"position":"IN"}
        })
        .then(function (data) {
             return data
        })
    }
    
    /**
     * 修改分类
     * @param {Object} id
     * @param {Object} seid
     * @param {Object} name
     */
    function updatelist(id,seid,name){
         return $http({
            url:"/api-admin/category/"+id+"/update",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"id":id,"name":name}
        })
        .then(function (data) {
             return data
        })
    }
    
    /**
     * 删除分类
     */
    function removelist(id,seid){
         return $http({
            url:"/api-admin/category/"+id+"/remove",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"id":id,"name":name}
        })
        .then(function (data) {
             return data
        })
    }
    
    /**
     * 获取某个分类
     */
    function getlist(id,seid){
        return $http({
            url:"/api-admin/category/"+id+"/get",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"id":id}
        })
        .then(function (data) {
             return data
        })
    }
}
})();