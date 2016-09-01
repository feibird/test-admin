(function(){
"use strict"
angular
    .module("index_area",["ui.router",'LocalStorageModule','ui.bootstrap','ngTable','angularFileUpload'])
    .constant("device","pc")			//定义全局变量:设备编号
    .constant("version","2.0.0")		//定义全局变量:版本号
    .config(function($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider) {
        $urlRouterProvider.otherwise("/stores/list");
        
        $httpProvider.defaults.transformRequest = function(obj){
     var str = [];
     for(var p in obj){
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
     }
     return str.join("&");
   }

   $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded'
   }
        
        $stateProvider
        .state("/sort/list", {											                       //分类管理
                url: "/sort/list",
                templateUrl: "Sort/list.html",
                 controller: 'SortlistCtrl as SortlistCtrl',
                 params: {'index':3}
        })
        .state("/supplierlogo/list", {									                          //供应商品牌
                url: "/supplierlogo/list",  
                templateUrl: "SupplierLogo/list.html",
                 controller: 'SupplierLogolistCtrl as SupplierLogolistCtrl',
                 params: {'index':5}
        })
         .state("/brandstores/list", {								                        	//连锁品牌
                url: "/brandstores/list",
                templateUrl: "BrandStores/list.html",
                controller: 'BrandStoreslistCtrl as BrandStoreslistCtrl',
                params: {'index':5}
        })
        .state("/stores/list", {                                                                 //门店管理
                url: "/stores/list",
                templateUrl: "Stores/list.html",
                controller: 'StoreslistCtrl as StoreslistCtrl',
                params: {'index':5}
        })
    .state("/label/list", {                                                                      //标签管理
                url: "/label/list",
                templateUrl: "Label/list.html",
                controller: 'LabellistCtrl as LabellistCtrl',
                params: {'index':5}
        })
        .state("/order/orderlist", {                                                              //订单管理
                url: "/order/orderlist",
                templateUrl: "Order/Orderlist.html",
                controller: 'OrderlistCtrl as OrderlistCtrl',
            params: {'index':5}
        })
        .state("/good/list", {                                                                   //商品管理
                url: "/good/list",
                templateUrl: "Good/list.html",
                controller: 'GoodlistCtrl as GoodlistCtrl',
                params: {'index':5}
        })
        .state("/finance/list", {                                                               //财务管理
                url: "/finance/drawlist",
                templateUrl: "Finance/drawlist.html",
                controller: 'DrawlistCtrl as DrawlistCtrl',
                params: {'index':5}
        })
        .state("/market/list", {                                                               //运营管理
                url: "/market/list",
                templateUrl: "Market/list.html",
                controller: 'MarketListCtrl as MarketListCtrl',
                params: {'index':5}
        })
        .state("/user/userlist", {                                                               //用户管理
                url: "/user/userlist",
                templateUrl: "User/Userlist.html",
                controller: 'UserListCtrl as UserListCtrl',
                params: {'index':5}
        })
        .state("/user/rolelist", {                                                               //角色管理
                url: "/user/rolelist",
                templateUrl: "User/Rolelist.html",
                controller: 'RoleListCtrl as RoleListCtrl',
                params: {'index':5}
        })
        .state("/music/list", {                                                               //语音管理
                url: "/music/musiclist",
                templateUrl: "Music/list.html",
                controller: 'MusicListCtrl as MusicListCtrl',
                params: {'index':5}
        })
          //去掉#号  
        /*$locationProvider.html5Mode(true);*/
        
    })
    .run(run);
run.$inject = ['$rootScope', '$state', '$location','localStorageService','PublicResource']
function run($rootScope, $state, $location, localStorageService,PublicResource) {
    var seid;
    login();
    var userName;
    var user;

    PublicResource.user(seid).then(function(data){
        userName = data.result.name;
    });
    $rootScope.userName =userName;
        function login(){
        user=PublicResource.seid("admin");           
        if(typeof(user)=="undefined"){
            layer.alert("尚未登录！",{icon:2},function(index){
                layer.close(index);
                PublicResource.Urllogin();
            })
        }else{
            seid = PublicResource.seid(user);
        }
    }

    $rootScope.logout = function(){
        PublicResource.logout(seid).then(function(data){
            console.log(data);
            if(data.status=='OK'){
                layer.alert('退出成功~',{icon:1},function(){
                    $.session.remove('admin');
                    $.session.remove(user);
                    layer.closeAll();
                    PublicResource.Urllogin();
                })
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
angular.module('index_area').factory('BrandStoresResource', BrandStoresResource);
BrandStoresResource.$inject = ['$http','device','version'];
function BrandStoresResource($http,device,version) {
    return {
        list:list,
        add:add,
        remove:remove,
        get:get,
        update:update
    };
    
	/**
	 * list
	 * 获取列表
	 */
    function list(seid,skip,limit){    	
        return $http.get("/api-admin/brand/list",{params:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "skip":skip,
                "limit":limit
            }}).then(function(data){
            return data
        })
    }    
    
    /**
     * 添加分类
     */
    function add(obj,seid){  
        return $http({
            url:"/api-admin/brand/add",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
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
    function remove(id,seid){
        return $http({
            url:"/api-admin/brand/"+id+"/remove",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,"id":id}
        })
        .then(function (data) {
             return data
        })
    }
    
    
    
    /**
     * 获取某个分类
     */
    function get(seid,id){    	     	
         return $http.get("/api-admin/brand/"+id+"/get",{params:{"device":device,"version":version,"sessionId":seid,"id":id}}).then(function(data){
            return data
        })
        
    }
   

     /**
     * 修改分类
     */
    function update(obj,seid){        
         return $http({
            url:"/api-admin/brand/"+obj.id+"/update",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,"name":obj.name,"logo":obj.logo,"sort":obj.sort}
        })
        .then(function (data) {
             return data
        })
    }

}
})();
(function(){
"use strict"
angular.module('index_area').controller('BrandStoreslistCtrl',BrandStoreslistCtrl);
BrandStoreslistCtrl.$inject = ['$state','$scope','$rootScope','NgTableParams','PublicResource','BrandStoresResource','SortResource','$stateParams','FileUploader'];
/***调用接口***/
function BrandStoreslistCtrl($state,$scope,$rootScope,NgTableParams,PublicResource,BrandStoresResource,SortResource,$stateParams,FileUploader) {
    document.title ="连锁品牌管理";
	$rootScope.name="连锁品牌管理";
	$rootScope.childrenName="连锁品牌管理列表";
    var vm = this;
	vm.skip = 0;
	vm.limit = 12;
	vm.seid
	vm.addinfo;																//添加数据对象
	vm.list;																//数据列表集合
	vm.sortlist;															//分类列表集合															
	vm.getlist = new Object();															//修改数据对象
    /**
     * 删除
     */
    vm.delBtn = function(id){
    	console.log(id)
    	layer.confirm('您确定要删除品牌？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			remove(id)
		});
    }

	vm.updateBtn = function(){
		update();
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
   list(vm.seid);
    
    //开启模态框
	vm.openmask = function(status,id){
		var calssName;
		var title;
		switch(status){
			case 'add':
				calssName = '.info_add'
				title = '新增连锁品牌'
			break;
			case 'update':
				calssName=".info_update"
				title = '修改连锁品牌'
				get(id)
			break;
			case 'get':
				calssName='.info_get'
				title = '连锁品牌信息'
				get(id)
			break;
		}
		layer.open({
		  type: 1,
		  title:title,
		  area: ['440px', '515px'], //宽高
		  content:$(calssName)
		});
		
	}
	
	//关闭弹出层
	vm.closechildren = function(){		
		layer.closeAll();
	}
	
	/**
	 * 连锁品牌集合
	 * @param {Object} seid
	 */
	function list(){
		 BrandStoresResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
	    	vm.list=data.data.result;
			vm.tableParams = new NgTableParams({},{dataset:vm.list.data});
	    	vm.pagecount = data.data.result.total
	    	console.log(data)
	    })
	}

	function update(){
		console.log(vm.getlist)
		BrandStoresResource.update(vm.getlist,vm.seid).then(function(data){
			if (data.data.status=="OK") {
				layer.msg("修改成功~",{icon:1},function(){
					layer.closeAll();
				});
				list(vm.seid);
			}else{
				layer.msg("修改异常~请联系程序员",{icon:0});
			}
		})
	}

	function add(){
		BrandStoresResource.add(vm.addinfo,vm.seid).then(function(data){
			console.log(data)
			if (data.data.status=="OK") {
				layer.alert("上传成功~",{icon:1},function(){
					layer.closeAll();
				});
				list(vm.seid);
			}else{
				layer.alert(data.message,{icon:0});
			}
		})
	}

	function get(id){
		BrandStoresResource.get(vm.seid,id).then(function(data){
			vm.getlist = data.data.result;
			console.log(data)
		})
	}

	function remove(id){
		BrandStoresResource.remove(id,vm.seid).then(function(data){
			console.log(data);
			if (data.data.status=="OK") {					
				layer.alert('删除成功~',{icon: 1});					
			} else{
				layer.alert(data.data.message.data,{icon: 0});
			}
			list(vm.seid);
		})
	}

	function sortlist(){
		SortResource.list(vm.seid).then(function(data){
			vm.sortlist = data.data.result.root
			console.log(vm.sortlist)
		})
	}

	var logo = vm.logo = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	logo.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.logo.queue) {
				vm.logo.queue[i].isSuccess=false;
				vm.logo.queue[i].isError=true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.getlist.logo=status.result;
             vm.logo.queue[0].remove();
        }
	}
	logo.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}

	     /**update
	 * [logo description]
	 * @type {[type]}
	 */
	var logos = vm.logos = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	logos.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.logos.queue) {
				vm.logos.queue[i].isSuccess=false;
				vm.logos.queue[i].isError=true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.getlist.logo=status.result;
             vm.logos.queue[0].remove();
        }
	}
	logo.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}
}

})();
(function(){
"use strict"
angular.module('index_area').controller('DrawDetailCtrl',DrawDetailCtrl);
DrawDetailCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','StoresResource','DrawResource','NgTableParams'];
/***调用接口***/
function DrawDetailCtrl($state,$scope,PublicResource,$stateParams,$rootScope,StoresResource,DrawResource,NgTableParams) {
    document.title ="提现管理";
    $rootScope.name="提现管理";
	$rootScope.childrenName="提现管理列表";
    var vm = this;
    vm.id = $stateParams.id;
    
    login();
    get();
   

   function get(){
   	DrawResource.get(vm.seid,vm.id).then(function(data){
   		vm.info = data.data.result;
   		console.log(vm.info);
   		vm.info.createDate = chang_time(new Date(vm.info.createDate));
   		if (vm.info.endDate != null) {
          vm.info.endDate = chang_time(new Date(vm.info.endDate));
        }
      })
   }

   vm.status = function(status){
      switch(status){
        case 'complete':
        layer.confirm('是否打款？', {
            btn: ['确定','取消'] //按钮
            }, function(){
                complete()
            });
           
        break;
        case 'operaOk':
        layer.confirm('是否通过？', {
            btn: ['确定','取消'] //按钮
            }, function(){
                operaOk();
            });
            
        break;
        case 'FinanOk':
        layer.confirm('是否通过？', {
            btn: ['确定','取消'] //按钮
            }, function(){
                FinanOk();
            });
        break;
      }
   }

 //确认打款
  function complete() {
    DrawResource.complete(vm.seid, vm.info).then(function(data) {
      console.log(data);
      if (data.data.status == "OK") {
        layer.msg("操作成功~", {
          icon: 1
        });
      } else {
        layer.msg(data.data.message, {
          icon: 2
        });
      }
      list();
    });
  }

  //财务审核成功
  function FinanOk() {
    DrawResource.FinanOk(vm.seid, vm.info).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //运营审核成功
  function operaOk() {
    DrawResource.operaOk(vm.seid, vm.info).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  function login() {
    vm.user = PublicResource.seid("admin");
    if (typeof(vm.user) == "undefined") {
      layer.alert("尚未登录！", {
        icon: 2
      }, function(index) {
        layer.close(index);
        PublicResource.Urllogin();
      });
    } else {
      vm.seid = PublicResource.seid(vm.user);
    }
  }

  function chang_time(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        console.log(h.length);
        if (D.length < 3) {
          D = "0" + D;
        }
        console.log(D.length + ',' + D);
        if (m.length < 3) {
          m = "0" + m;
        }

        if (s < 9) {
          s = "0" + s;
        }
        return Y + M + D + h + m + s;
    }
}

})();
(function(){
"use strict"
angular.module('index_area').config(config).controller('DrawlistCtrl', DrawlistCtrl);

function config($stateProvider) {
  $stateProvider
    .state("detail", {
      url: "/finance/drawdetail/{id:string}",
      templateUrl: "Finance/DrawDetail.html",
      controller: 'DrawDetailCtrl as DrawDetailCtrl'
    })
    .state("recordedlist", {
      url: "/finance/recordedlist",
      templateUrl: "Finance/Recordedlist.html",
      controller: 'RecordedlistCtrl as RecordedlistCtrl'
    })
}
DrawlistCtrl.$inject = ['$state', '$scope', 'PublicResource', '$stateParams', '$rootScope', 'StoresResource', 'DrawResource', 'NgTableParams','$http',"device","version"];
/***调用接口***/
function DrawlistCtrl($state, $scope, PublicResource, $stateParams, $rootScope, StoresResource, DrawResource, NgTableParams,$http,device,version) {
  document.title = "提现管理";
  $rootScope.name = "提现管理";
  $rootScope.childrenName = "提现管理列表";
  var vm = this;
  vm.skip = 0; //起始数据下标
  vm.limit = 10; //最大数据下标
  vm.stores; //门店集合
  vm.list;
  vm.get = new Object();
  vm.get.status = "";
  vm.get.id = "";
  vm.fusName;
  vm.oper;
  vm.updateinfo = new Object();
  vm.updateinfo.serialNumber = "";
  vm.updateinfo.storeId = "";
  vm.updateinfo.applyStartDate = "";
  vm.updateinfo.applyEndDate = "";
  vm.updateinfo.completeStartDate = "";
  vm.updateinfo.completeEndDate = "";
  vm.updateinfo.status = "";
  vm.updateinfo.ids = new Array();
  vm.filer = new Object();
  //获取sessionId
  login();
1
  function login() {
    vm.user = PublicResource.seid("admin");
    if (typeof(vm.user) == "undefined") {
      layer.alert("尚未登录！", {
        icon: 2
      }, function(index) {
        layer.close(index);
        PublicResource.Urllogin();
      });
    } else {
      vm.seid = PublicResource.seid(vm.user);
    }
  }

  PublicResource.user(vm.seid).then(function(data){
      vm.Role = data.result;
      console.log(vm.Role)
  })

  PublicResource.RoleUser(vm.seid,vm.Role.id).then(function(data){
      vm.UserOper = data.result;
      console.log(vm.UserOper)
      for(var i in vm.UserOper){
          if(vm.UserOper[i].name=='财务管理员'){
            vm.oper = 1;
          }else if(vm.UserOper[i].name=='运营管理员'){
             vm.oper = 2;
          }else if(vm.UserOper[i].name=='后台管理员'){
            vm.oper = 3;
          }
      }
      console.log(vm.oper)
  })

  //财务审核成功
  function FinanOk() {
    DrawResource.FinanOk(vm.seid, vm.updateinfo).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //财务审核失败
  function FinanNo() {
    DrawResource.FinanNo(vm.seid, vm.updateinfo).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //运营审核成功
  function operaOk() {
    DrawResource.operaOk(vm.seid, vm.updateinfo, 0, 100).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //运营审核失败
  function operaNo() {
    DrawResource.operaNo(vm.seid, vm.updateinfo,0,100).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //汇总统计
  function count() {
    DrawResource.count(vm.seid,vm.updateinfo,0,100).then(function(data) {
      vm.count = data.data.result;
    })
  }

  //导出表格
  function exel() {
    var applyStartDate = dateTime(vm.updateinfo.applyStartDate)?dateTime(vm.updateinfo.applyStartDate):"";
    var applyEndDate = dateTime(vm.updateinfo.applyEndDate)?dateTime(vm.updateinfo.applyEndDate):"";
    var completetStartDate = dateTime(vm.updateinfo.completetStartDate)?dateTime(vm.updateinfo.completetStartDate):"";
    var completeEndDate = dateTime(vm.updateinfo.completeEndDate)?dateTime(vm.updateinfo.completeEndDate):"";
    window.open("/api-admin/report/draw/excel?sessionId="+vm.seid
      +"&device="+'pc'
      +"&version="+'2.0.0'
      +"&status="+vm.updateinfo.status
      +"&serialNumber="+vm.updateinfo.serialNumber
      +"&storeId="+vm.updateinfo.storeId
      +"&applyStartDate="+applyStartDate
      +"&applyEndDate="+applyEndDate
      +"&completetStartDate="+completetStartDate
      +"&completeEndDate="+completeEndDate
      )
  }

  //确认打款
  function complete() {
    DrawResource.complete(vm.seid, vm.updateinfo,0,100).then(function(data) {
      console.log(data);
      if (data.data.status == "OK") {
        layer.msg("操作成功~", {
          icon: 1
        });
      } else {
        layer.msg(data.data.message, {
          icon: 2
        });
      }
      list();
    });
  }

  vm.statusBtn = function(fusName, id) {
    vm.updateinfo.ids = [];
    vm.fusName = fusName;
    vm.updateinfo.ids.push(id);
    console.log(vm.updateinfo)
    layer.open({
      type: 1,
      title: "信息",
      area: ['450px', "330px"], //宽高
      content: $('.alertDiv')
    });
  };

  vm.Get = function() {
    vm.updateinfo.completeEndDate=GTM(true,vm.updateinfo.completeEndDate)
    vm.updateinfo.completeStartDate=GTM(false,vm.updateinfo.completeStartDate)
    vm.updateinfo.applyStartDate=GTM(false,vm.updateinfo.applyStartDate)
    vm.updateinfo.applyEndDate=GTM(true,vm.updateinfo.applyEndDate)
    list();
  };

  function GTM(is,data){
    console.log(data)
    if(typeof(data)=='undefined'||data==""||data==null){
        return null
    }else{
        data = chang_time(data);
        if(is){
            data = data+"23:59:59";
        }
        return data = new Date(data).getTime();
    }
    
  }


  vm.exel = function(){
      exel()
  }

  vm.countBtn = function(){
    layer.open({
      type: 1,
      title:'详情',
      area: ['700px',"550px"], //宽高
      content:$('.count')
    })
    count();
  }

  vm.Credential = function(id) {
    get(id)
    layer.open({
      type: 1,
      title:'提现详情',
      area: ['700px',"550px"], //宽高
      content:$('.credential')
    })
  }

  vm.count_detailBtn = function(){
    layer.open({
      type: 1,
      title:'详情',
      area: ['1000px',"550px"], //宽高
      content:$('.count-detail')
    })
    count_list();
  }

  vm.alertBtn = function() {
    console.log(vm.updateinfo);
    switch (vm.fusName) {
      case "operaNo":
        operaNo();
        break;
      case "operaOk":
        operaOk();
        break;
      case "FinanNo":
        FinanNo();
      break;
      case "FinanOk":
        FinanOk();
      break;
      case "complete":
        complete();
        break;
    }
    layer.closeAll();
  }
  var num = true;
  vm.All = function() {
    for (var i in vm.list) {
      if (num) {
        vm.list[i].active = true;
      } else {
        vm.list[i].active = false;
      }
    }
    num = !num;
  }

  vm.operaBtn = function(status, fusName) {
    vm.updateinfo.ids = [];
    var x = 0;
    for (var i in vm.list) {
      if (vm.list[i].active == true) {
        if (vm.list[i].status == status) {
          vm.updateinfo.ids.push(vm.list[i].id)
        } else {
          x += 1;
        }
      } else {

      }
    }
    if (x != 0) {
      layer.msg("有" + x + "条数据状态不符合,请先筛选订单状态！", {
        icon: 2
      })
      return false;
    }

    switch (fusName) {
      case "operaNo":
        operaNo();
        break;
      case "operaOk":
        operaOk();
        break;
      case "FinanNo":
        FinanNo();
        break;
      case "FinanOk":
        FinanOk();
        break;
      case "complete":
        complete();
        break;
    }


  }

  /**
   * 初始化
   */
  initialize();

  function initialize() {
    store();
    list();
  }

  function store() {
    StoresResource.list(vm.seid, 0, 0).then(function(data) {
      vm.stores = data.data.result.data;
      console.log(vm.stores);
    });
  }

  function list() {

    vm.tableParams = new NgTableParams({
        page: 1, // show first page
        count: 10, // count per page
        per_page:10
    }, {
        filterDelay: 300,
        getData: function(info) {
            vm.skip=vm.limit*(info.page()-1);
            return $http.get("/api-admin/draw/list", {
              params: {
                "device": device,
                "version": version,
                "sessionId": vm.seid,
                "skip": vm.skip,
                "limit": vm.limit,
                'storeId': vm.updateinfo.storeId,
                'status': vm.updateinfo.status,
                "applyStartDate":vm.updateinfo.applyStartDate,
                "applyEndDate": vm.updateinfo.applyEndDate,
                "completeStartDate":vm.updateinfo.completeStartDate,
                "completeEndDate":vm.updateinfo.completeEndDate,
                "serialNumber": vm.updateinfo.serialNumber
              }
            }).then(function(data){
                console.log(info.page())
                info.total(data.data.result.total);
                info.per_page=10;
                for(var i in data.data.result.data){
                  data.data.result.data[i].createDate = chang_time(new Date(data.data.result.data[i].createDate))
                  data.data.result.data[i].endDate = chang_time(new Date(data.data.result.data[i].endDate))
                }
                return data.data.result.data;
            })
        }
    });
  }

  function get(id){
    DrawResource.get(vm.seid,id).then(function(data){
      vm.credential = data.data.result;
      console.log(vm.credential);
      vm.credential.createDate = chang_time(new Date(vm.credential.createDate));
      if (vm.credential.endDate != null) {
          vm.credential.endDate = chang_time(new Date(vm.credential.endDate));
        }
      })
   }

  function count_list() {
    DrawResource.list(vm.seid, vm.updateinfo, 0, 100).then(function(data) {
      vm.count_detail = data.data.result.data;
      for (var i in vm.list) {
        vm.count_detail[i].active = false;
        vm.count_detail[i].createDate = chang_time(new Date(vm.count_detail[i].createDate));
        if (vm.count_detail[i].endDate != null) {
          vm.count_detail[i].endDate = chang_time(new Date(vm.count_detail[i].endDate));
        }
      }
      console.log(vm.count_detail);
    });
  }


  function chang_time(date) {
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' '; //天
    var h = date.getHours() + ':'; //时
    var m = date.getMinutes() + ':'; //分
    var s = date.getSeconds();
    if (D.length < 3) {
      D = "0" + D;
    }
    if (m.length < 3) {
      m = "0" + m;
    }

    if (s < 9) {
      s = "0" + s;
    }

    if (h.length<3) {
      h = "0" + h;
    }
    return Y + M + D;
  }

  //修改时间格式(时间戳转换)
  function dateTime(data) {
    if (data == null || data.length < 1) {
      return false;
    }
    console.log(data)
    var date = data.split('-');
    var time = new Date(date[0], date[1] - 1, date[2]).getTime();
    console.log(time)
    return time;
  }

  function update(status, id) {
    DrawResource.update(vm.seid, status, id).then(function(data) {
      console.log(data);
      if (data.data.status == "OK") {
        layer.alert('修改成功', {
          icon: 1
        });
      } else {
        layer.alert(data.data.message, {
          icon: 2
        });
      }
      list();
    });
  }

  $(function(){
      $(".printBtn").click(function(){
        var ClassName  = $(this).attr('name');
        console.log(ClassName);
        $(this).hide();
        $(ClassName).jqprint();
        $(this).show();
      })
    })

}
})();
(function(){
"use strict"
/**
 * 提供功能API封装
 */
angular.module('index_area').factory('DrawResource', DrawResource);
DrawResource.$inject = ['$http', 'device', 'version'];

function DrawResource($http, device, version) {
  return {
    list: list,
    get: get,
    update: update,
    complete: complete,
    operaOk: operaOk,
    operaNo: operaNo,
    FinanNo: FinanNo,
    FinanOk: FinanOk,
    count:count
  };


  /**
   * list
   * 获取门店列表
   */
  function list(seid, obj, skip, limit) {
    return $http.get("/api-admin/draw/list", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        'storeId': obj.storeId,
        'status': obj.status,
        "applyStartDate":obj.applyStartDate,
        "applyEndDate": obj.applyEndDate,
        "completeStartDate":obj.completeStartDate,
        "completeEndDate":obj.completeEndDate,
        "serialNumber": obj.serialNumber
      }
    }).then(function(data) {
      return data
    })
  }

  /**
   * 修改信息
   * @param {Object} id
   * @param {Object} seid
   * @param {Object} name
   */
  function update(seid, status, id) {
    return $http({
        url: "/api-admin/draw/" + id + "/update",
        method: 'post',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
          "status": status,
          "device": device,
          "version": version,
          "sessionId": seid
        }
      })
      .then(function(data) {
        return data;
      })
  }

  /**
   * 获取某个订单
   */
  function get(seid,id) {
    return $http.get("/api-admin/draw/" + id + "/get", {
      params: {
        "device": device,
        "version": version,
        "sessionId":seid
      }
    }).then(function(data) {
      return data
    })
  }

  //确认打款
  function complete(seid, obj) {
    if(typeof(obj.ids)=='undefined'){
      var ids = obj.id
    }else{
      var ids = arry(obj.ids);
    }
    return $http({
        url: "/api-admin/draw/complete",
        method: 'post',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
          "ids": ids,
          "device": device,
          "version": version,
          "sessionId": seid,
          "remark": obj.remark
        }
      })
      .then(function(data) {
        return data;
      })
  }

  //运营审核通过
  function operaOk(seid, obj) {
    if(typeof(obj.ids)=='undefined'){
      var ids = obj.id
    }else{
      var ids = arry(obj.ids);
    }
    return $http({
        url: "/api-admin/draw/approve-operate",
        method: 'post',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
          "device": device,
          "version": version,
          "sessionId": seid,
          "ids": ids,
          "remark": obj.remark
        }
      })
      .then(function(data) {
        return data;
      })
  }

  //运营审核失败
  function operaNo(seid, obj) {
    if(typeof(obj.ids)=='undefined'){
      var ids = obj.id
    }else{
      var ids = arry(obj.ids);
    }
    
    return $http({
        url: "/api-admin/draw/reject-operate",
        method: 'post',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
          "device": device,
          "version": version,
          "sessionId": seid,
          "ids": ids,
          "remark": obj.remark
        }
      })
      .then(function(data) {
        return data;
      })
  }

  //财务审核不通过
  function FinanNo(seid, obj) {
    if(typeof(obj.ids)=='undefined'){
      var ids = obj.id
    }else{
      var ids = arry(obj.ids);
    }
    return $http({
        url: "/api-admin/draw/reject-finance",
        method: 'post',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
          "device": device,
          "version": version,
          "sessionId": seid,
          "ids": ids,
          "remark": obj.remark
        }
      })
      .then(function(data) {
        return data;
      })
  }

  //财务审核通过
  function FinanOk(seid, obj) {
    if(typeof(obj.ids)=='undefined'){
      var ids = obj.id
    }else{
      var ids = arry(obj.ids);
    }
    return $http({
        url: "/api-admin/draw/approve-finance",
        method: 'post',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
          "device": device,
          "version": version,
          "sessionId": seid,
          "ids": ids,
          "remark": obj.remark
        }
      })
      .then(function(data) {
        return data;
      })
  }

  function count(seid, obj, skip, limit) {
    console.log(obj);
    return $http.get("/api-admin/draw/sum", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        'storeId': obj.storeId,
        'status': obj.status,
        "applyStartDate": dateTime(obj.applyStartDate) ? dateTime(obj.applyStartDate) : null,
        "applyEndDate": dateTime(obj.applyEndDate) ? dateTime(obj.applyEndDate) : null,
        "completetStartDate": dateTime(obj.completetStartDate) ? dateTime(obj.completetStartDate) : null,
        "completeEndDate": dateTime(obj.completeEndDate) ? dateTime(obj.completeEndDate) : null,
        "serialNumber": obj.serialNumber
      }
    }).then(function(data) {
      return data
    })
  }

  //将数组组成字符串
  function arry(obj) {
    if(typeof(obj)=="undefined"){
      return obj
    }
    var ids = "";
    for (var i in obj) {
      ids += obj[i] + ","
    }
    console.log(ids);
    ids = ids.substring(0, ids.length - 1);

    return ids;
  }

  //修改时间格式(时间戳转换)
  function dateTime(data) {
    if (data == null || data.length < 1) {
      return false;
    }
    console.log(data)
    var date = data.split('-');
    console.log(date);
    var time = new Date(date[0], date[1] - 1, date[2]).getTime();
    return time;
  }


}
})();
(function(){
"use strict"
angular.module('index_area').controller('RecordedlistCtrl', RecordedlistCtrl);
RecordedlistCtrl.$inject = ['$state', '$scope', 'PublicResource', '$stateParams', '$rootScope', 'StoresResource', 'RecordedResource', 'NgTableParams'];
/***调用接口***/
function RecordedlistCtrl($state, $scope, PublicResource, $stateParams, $rootScope, StoresResource, RecordedResource, NgTableParams) {
  document.title = "入账管理";
  $rootScope.name = "入账管理";
  $rootScope.childrenName = "入账管理列表";
  var vm = this;
  vm.filer = new Object();
  vm.filer.storeId = "";
  vm.filer.sources = "";
  vm.filer.minTotalAmount = "";
  vm.filer.maxTotalAmount = "";
  vm.filer.takeNo = "";
  vm.filer.tradeId = "";
  vm.filer.createStartDate="";
  vm.filer.createEndDate = ""
  vm.pagecount; 
  vm.skip=0;
  vm.limit=50;                                                          //分页总数
  vm.pageint = 1;

  //分页点击事件
  vm.pageChanged = function () {
    vm.skip = (vm.pageint - 1) * vm.limit;
    list(vm.seid);
  }
  login();

  //筛选查询
  vm.filerList = function(){
    vm.filer.createStartDate = GTM(false,vm.filer.createStartDate)
    vm.filer.createEndDate = GTM(true,vm.filer.createEndDate)
    list();
  }

  function GTM(is,data){
    console.log(typeof(data))
    if(typeof(data)=='undefined'||data==""||data==null||typeof(data)=='number'){
        return data;
    }else{
        data = chang_time(data);
        if(is){
            data = data+"23:59:59";
        }
        return data = new Date(data).getTime();
    }
    
  }

  vm.clearFiler = function(){
    vm.filer.storeId = "";
    vm.filer.sources = "";
    vm.filer.minTotalAmount = "";
    vm.filer.maxTotalAmount = "";
    vm.filer.takeNo = "";
    vm.filer.tradeId = "";
    vm.filer.createStartDate="";
     vm.filer.createEndDate="";
  }

  //查看
  vm.open = function(item){
    vm.info = item;
    layer.open({
		  type: 1,		  
		  title:"订单信息",
		  area: ['440px', 'auto'], //宽高
		  content:$(".open")
		});
  }

  vm.exel = function(){
    vm.filer.createStartDate = GTM(false,vm.filer.createStartDate)
    vm.filer.createEndDate = GTM(true,vm.filer.createEndDate)
    console.log(vm.filer)
    window.open("/api-admin/report/trade/detail/excel?sessionId="+vm.seid
          +"&device="+'pc'
          +"&version="+'2.0.0'
          +"&sources="+vm.filer.sources
          +"&detail="+vm.filer.detail
          +"&storeId="+vm.filer.storeId
          +"&completeEndDate="+vm.filer.createEndDate
          +"&completeStartDate="+vm.filer.createStartDate
          )
   
  }

  function login() {
    vm.user = PublicResource.seid("admin");
    if (typeof (vm.user) == "undefined") {
      layer.alert("尚未登录！", {
        icon: 2
      }, function (index) {
        layer.close(index);
        PublicResource.Urllogin();
      });
    } else {
      vm.seid = PublicResource.seid(vm.user);
    }
  }

  list();
  stores();
  //入账列表
  function list() {
    RecordedResource.list(vm.seid,vm.filer,vm.skip,vm.limit).then(function (data) {
      console.log(data.data)
      vm.list = data.data.result;
      for (var i in vm.list) {
        vm.list[i].payment.createDate = chang_time(new Date(vm.list[i].payment.createDate));
      }
      console.log(vm.list)
    })
  }

  total()
  function total(){
    RecordedResource.total(vm.seid).then(function(data){
        vm.pagecount = data.data.result;
        console.log(vm.pagecount)
    })
  }

  //获取所有门店
  function stores() {
    StoresResource.list(vm.seid, 0, 0).then(function (data) {
      vm.store = data.data.result.data;
      console.log(vm.store)
    })
  }

   function chang_time(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        if (D.length < 3) {
            D = "0" + D;
        }
        if (m.length < 3) {
            m = "0" + m;
        }

        if (s < 9) {
            s = "0" + s;
        }
        return Y + M + D;
    }

}

})();
(function(){
"use strict"
/**
 * 提供功能API封装
 */
angular.module('index_area').factory('RecordedResource', RecordedResource);
RecordedResource.$inject = ['$http', 'device', 'version'];

function RecordedResource($http, device, version) {
  return {
    list: list,
    get: get,
    total:total
  };


  /**
   * list
   * 获取入账列表
   */
  function list(seid, obj, skip, limit) {
    console.log(obj)
    return $http.get("/api-admin/journal/list", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        "storeId":obj.storeId,
        "sources":obj.sources,
        "maxTotalAmount":obj.maxTotalAmount,
        "minTotalAmount":obj.minTotalAmount,
        "takeNo":obj.takeNo,
        "tradeId":obj.tradeId,
        "createStartDate":obj.createStartDate,
        "createEndDate":obj.createEndDate
      }
    }).then(function (data) {
      return data
    })
  }

  function total(seid){
      return $http.get('/api-admin/journal/count',{
        params:{
          "device": device,
        "version": version,
        "sessionId": seid
        }
      }).then(function(data){
          return data
      })
  }


  /**
   * 获取某个订单
   */
  function get(seid, id) {
    return $http.get("/api-admin/draw/" + id + "/get", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid
      }
    }).then(function (data) {
      return data
    })
  }


}
})();
(function(){
"use strict"
angular.module('index_area').controller('AddGoodCtrl',AddGoodCtrl);
AddGoodCtrl.$inject = ['$state','$rootScope','PublicResource','$stateParams','GoodResource',"SortResource","SupplierLogoResource","LabelResource","BrandStoresResource",'FileUploader'];
/***调用接口***/
function AddGoodCtrl($state,$rootScope,PublicResource,$stateParams,GoodResource,SortResource,SupplierLogoResource,LabelResource,BrandStoresResource,FileUploader) {
    document.title ="添加规格";
    $rootScope.name="商品管理";
    $rootScope.childrenName="添加规格";
    var vm = this;
    vm.skip=0;				//起始数据下标FileUploader
    vm.limit=12;			//最大数据下标
    vm.cLogo;
    vm.bLogo;
    vm.cPhotos;
    vm.bPhotos;
    vm.info = new Object();
    vm.info.cLogo = [];
    vm.info.bLogo = [];
    vm.info.cPhotos = [];
    vm.info.bPhotos = [];
    vm.info.name="";
    vm.info.detail = "";
    vm.info.shortName="";
    vm.id=$stateParams.id;
    console.log(vm.id)

    //获取sessionId


    login();
    
    inital();
    function inital(){
        sortlist();
        brandlist();
        labellist();
        logolist();
    }

    vm.addBtn = function(){
        console.log(vm.info);
        add();
    }

    

    /**
	 * [bPhotos description]
	 * @type {[type]}
	 */
	var bPhotos = vm.bPhotos = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	bPhotos.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.bPhotos.queue) {
				vm.bPhotos.queue[i].isSuccess=false;
				vm.bPhotos.queue[i].isError=true;
                console.log(vm.bPhotos.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.bPhotos.push(status.result);
			 vm.bPhotos.queue[0].remove();
        }
	}
	bPhotos.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}

	/**
	 * [cPhotos description]
	 * @type {[type]}
	 */
	var cPhoto = vm.cPhotos = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]
	})

	cPhoto.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.cPhotos.queue) {
				vm.cPhotos.queue[i].isSuccess=false;
				vm.cPhotos.queue[i].isError=true;
                console.log(vm.cPhotos.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.cPhotos.push(status.result);
			 vm.cPhotos.queue[0].remove();
        }
	}
	cPhoto.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}



	/**
	 * bLogo
	 */
	 var bLogo = vm.bLogo = new FileUploader({
	 	url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}],
		queueLimit:1
	 })
	 bLogo.onSuccessItem = function (data,status) {
	 	 if(status.status!="OK"){
            for (var i in vm.bLogo.queue) {
				vm.bLogo.queue[i].isSuccess=false;
				vm.bLogo.queue[i].isError=true;
                console.log(vm.bLogo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.bLogo[0] = status.result;
			 vm.bLogo.queue[0].remove();
        }
	 }
	 bLogo.onErrorItem= function(){
		 vm.num = 5;
		 var time =setInterval(function () {
			 vm.num--;
			 console.log(11)
			 if(vm.num==0){
				 layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					 clearInterval(time);
					 return false;
				 });
			 }
		 },1200)
	 }
	/**
	 * cLogo
	 */
	 var cLogo = vm.cLogo = new FileUploader({
	 	url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}],
		queueLimit:1
	 })
	 cLogo.onSuccessItem = function (data,status) {
	 	 if(status.status!="OK"){
            for (var i in vm.cLogo.queue) {
				vm.cLogo.queue[i].isSuccess=false;
				vm.cLogo.queue[i].isError=true;
                console.log(vm.cLogo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.cLogo[0] = status.result;
			 vm.cLogo.queue[0].remove();
        }
	 }
	 cLogo.onErrorItem= function(){
		 vm.num = 5;
		 var time =setInterval(function () {
			 vm.num--;
			 console.log(11)
			 if(vm.num==0){
				 layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					 clearInterval(time);
					 return false;
				 });
			 }
		 },1200)
	 }
     function add(){
         GoodResource.add(vm.seid,vm.info).then(function(data){
             console.log(data)
             if(data.data.status=="OK"){
                 layer.confirm('商品添加成功~是否添加商品规格？', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        layer.closeAll()
                        $state.go('format',{id:data.data.result})
                    });
             }else{
                 layer.msg(data.data.message,{icon:2})
             }
         })
     }
     function arrayImage (data) {
        vm.data.cPhotos =data.cPhotos.split(",");
        vm.data.bPhotos =data.bPhotos.split(",");
        console.log(vm.data)
    }

    function sortlist(){
       SortResource.list(vm.seid,0,0).then(function(data){
            console.log(data.data.result);
            vm.sortlist = data.data.result;
        })
    }

    function brandlist(){
        BrandStoresResource.list(vm.seid,0,0).then(function(data){
            console.log(data.data.result);
            vm.brandlist = data.data.result;
        })
    }


    function logolist(){
        SupplierLogoResource.list(vm.seid,0,0).then(function(data){
            console.log(data.data.result);
            vm.logolist = data.data.result;
        })
    }


    function labellist(){
        LabelResource.list(vm.seid,0,0).then(function(data){
            console.log(data.data.result);
            vm.labellist = data.data.result;
        })
    }

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
}
})();
(function(){
"use strict"
angular.module('index_area').controller('FormatCtrl',FormatCtrl);
FormatCtrl.$inject = ['$state','$rootScope','PublicResource','$stateParams','FormatResource'];
/***调用接口***/
function FormatCtrl($state,$rootScope,PublicResource,$stateParams,FormatResource) {
    document.title ="商品详情";
    $rootScope.name="商品管理";
    $rootScope.childrenName="添加基础商品";
    var vm = this;
    vm.Addinfo = new Object();
    vm.seid;
    vm.id = $stateParams.id;

    vm.addBtn = function(){
        console.log(vm.Addinfo)
        add();
    }

    vm.delBtn = function(id){
         layer.confirm('是否确认删除此规格？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            remove(id)
            layer.closeAll()
           
        });
    }

    vm.updateBtn = function(data){
        if(data.status){
            if(update(data)){
                layer.msg('修改成功！',{icon:1});
                layer.closeAll();
                data.status=false;
            }
        }else{
            data.status = true;
        }
    }

    login();
    list();
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

    function add(){
        FormatResource.add(vm.seid,vm.id,vm.Addinfo).then(function(data){
            console.log(data);
            if(data.data.status=="OK"){
                layer.msg('添加成功~',{icon:1});
                list(vm.seid,vm.id)
            }else{
                layer.msg(data.data.message)
            }
        })
    }

    function update(info){
         FormatResource.update(vm.seid,vm.id,info).then(function(data){
            console.log(data);
            if(data.data.status=="OK"){
                layer.msg('添加成功~',{icon:1});
                list(vm.seid,vm.id)
            }else{
                layer.msg(data.data.message)
            }
        })
    }

    function remove(id){
        FormatResource.remove(vm.seid,id).then(function(data){
            console.log(data);
            if(data.data.status=="OK"){
                layer.msg('删除成功',{icon:1});
                list(vm.seid,vm.id)
            }else{

            }
        })
    }

    function list(){
        FormatResource.list(vm.seid,vm.id).then(function(data){
            console.log(data);
            if(data.data.status!="OK"){
                layer.msg(data.data.message,{icon:2});
            }
            vm.list = data.data.result;
            for(var i in vm.list){
                vm.list[i].status=false;
            }
        })
    }
}
})();
(function(){
"use strict"
angular.module('index_area').factory('FormatResource', FormatResource);
FormatResource.$inject = ['$http','device','version'];
function FormatResource($http,device,version) {
    return {
    	add:add,
    	list:list,
    	remove:remove,
    	get:get,
    	update:update
    };
    
	
	function add(seid,id,obj){		
	 return $http({
        url:"/api-admin/base/product/spec/add",
        method: 'post',
		headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"name":obj.name,
				"costPrice":obj.costPrice,
				"advicePrice":obj.advicePrice,
				"tradePrice":obj.tradePrice,
				"spec":obj.spec,
				"specUnit":obj.specUnit,
				"baseProductId":id
			}
    })
    .then(function (data) {
         return data
    })
	}
	
	function update(seid,id,obj){		
		 return $http({
            url:"/api-admin/base/product/spec/"+obj.id+"/update",
            method: 'post',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"name":obj.name,
				"costPrice":obj.costPrice,
				"advicePrice":obj.advicePrice,
				"tradePrice":obj.tradePrice,
				"spec":obj.spec,
				"specUnit":obj.specUnit,
				"baseProductId":id
			}
        })
        .then(function (data) {
             return data
        })
	}
	
	function list(seid,id){
		return $http.get("/api-admin/base/product/spec/list",{params:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"baseProductId":id
			}}).then(function(data){
			return data
		})
	}
	
	function remove(seid,id){
		 return $http({
            url:"/api-admin/base/product/spec/"+id+"/remove",
            method: 'post',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"id":id
			}
        })
        .then(function (data) {
             return data
        })
	}
	function get(seid,id){
		return $http.get("/api-admin/base/product/spec/"+id+"/get",{params:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"id":id
			}}).then(function(data){
			return data
		})
	}
}
})();
(function(){
"use strict"
angular.module('index_area').controller('GooddetialCtrl',GooddetialCtrl);
GooddetialCtrl.$inject = ['$state','$rootScope','PublicResource','$stateParams','FormatResource','GoodResource'];
/***调用接口***/
function GooddetialCtrl($state,$rootScope,PublicResource,$stateParams,FormatResource,GoodResource) {
	document.title ="商品详情";
	$rootScope.name="商品管理";
	$rootScope.childrenName="商品详情";
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.data;                //规格
    vm.updata=new Object();
	  vm.matlist=new Array();

    //获取sessionId
    
    
    login();
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
   	   	    
    	gooddetail(vm.id)
   	
   	/*
   	 * 基本商品
   	 */
   	function gooddetail(id){
   		GoodResource.get(vm.seid,id).then(function(data){   			
   			if(data.data.status!="OK"){
   				
   			}else{
   				vm.data = data.data.result;
          arrayImage(vm.data)
   			}
        console.log(vm.data)
   		})
   	}
   	
   

    function arrayImage (data) {
       vm.data.cPhotos =data.cPhotos.split(",");
       vm.data.bPhotos =data.bPhotos.split(",");
      console.log(vm.data)
    }
}
})();
(function(){
"use strict"
/**
 * 基础商品列表控制器
 */
angular.module('index_area').config(config).controller('GoodlistCtrl', GoodlistCtrl);
/***二级路由***/
config.$inject = ['$stateProvider'];
function config($stateProvider) {
    $stateProvider
        .state("addgood", {
            url: "/good/add",
            templateUrl: "Good/AddGood.html",
            controller: 'AddGoodCtrl as AddGoodCtrl'
        })
        .state("update", {
            url: "/good/update/{id:string}",
            templateUrl: "Good/UpdateGood.html",
            controller: 'UpdateGoodCtrl as UpdateGoodCtrl'
        }).state("format", {
            url: "/good/format/{id:string}",
            templateUrl: "Good/Format.html",
            controller: 'FormatCtrl as FormatCtrl'
        }).state("gooddetail", {
            url: "/good/gooddetail/{id:string}&{is:string}",
            templateUrl: "Good/goodDetail.html",
            controller: 'GooddetialCtrl as GooddetialCtrl'
        }).state("storegooddetail", {
            url: "/good/storegooddetail/{id:string}",
            templateUrl: "Good/storegooddetail.html",
            controller: 'StoreGooddetailCtrl as StoreGooddetailCtrl'
        })
}
GoodlistCtrl.$inject = ['$scope', '$rootScope', '$state', 'GoodResource', 'PublicResource', "$stateParams", 'NgTableParams'];
function GoodlistCtrl($scope, $rootScope, $state, GoodResource, PublicResource, $stateParams, NgTableParams) {
    document.title = "基础商品列表";
    $rootScope.name = "基础商品"
    $rootScope.childrenName = "基础商品列表"
    var vm = this;
    vm.seid;
    vm.pagecount;                                                           //分页总数
    vm.pageint = 1;                                                           //当前分页导航
    vm.skip = 0                                                               //从第几个开始
    vm.limit = 12;                                                            //从第几个结束
    vm.list;





    //获取sessionId
    login();
    list(vm.seid);
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", { icon: 2 }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            })
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }

    vm.delBtn = function (id) {
        layer.confirm('是否删除商品？', {
            btn: ["确定", '取消']
        }, function () {
            remove(id);
        })
    }

    /**
     * 基础商品集合
     * @param {Object} seid
     */
    function list(seid) {
        GoodResource.list(seid, null, 0,10).then(function (data) {
            vm.list = data.data.result;
            console.log(data)
            vm.tableParams = new NgTableParams({}, { dataset: vm.list.data });
            console.log(data.data.result)
        })
    }

    function remove(id) {
        GoodResource.del(vm.seid, id).then(function (data) {
            console.log(data)
            if (data.data.status == "OK") {
                layer.alert('删除成功~', { icon: 1 });
                list(vm.seid);
                layer.closeAll();
            } else {
                layer.msg('删除异常，请联系管理员~', { icon: 0 });
            }
        })
    }
}

})();
(function(){
"use strict"
angular.module('index_area').factory('GoodResource', GoodResource);
GoodResource.$inject = ['$http','device','version'];
function GoodResource($http,device,version) {
    return {
		list:list,
		add:add,
		update:update,
		del:del,
		get:get
    };
    
	
	/**
	 * [list 查询基础商品列表]
	 * @param  {[string]} seid  [sessionId]
	 * @param  {[number]} skip  [从下标数开始]
	 * @param  {[number]} limit [从下标数结束]
	 * @return {[type]}       [json]
	 */
	function list(seid,brandId,skip,limit){		
		return $http.get("/api-admin/base/product/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
			return data
		})
	}
	
	/**
	 * [getlist 获取单个商品数据]
	 * @param  {[number]} id   [商品ID]
	 * @param  {[string]} seid [sessionId]
	 * @return {[type]}      [json]
	 */
	function get(seid,id){
		return $http.get("/api-admin/base/product/"+id+"/get",{params:{"device":device,"version":version,"sessionId":seid}}).then(function(data){
			return data
		})
	}
	
	/**
	 * 添加基础商品
	 */
	function add(seid,obj){
			console.log(obj)
			var bPhotos="";
			var cPhotos="";
			var lables = "";
			for(var i in obj.bPhotos){				
				bPhotos+=obj.bPhotos[i]+",";				
			}
			for(var i in obj.cPhotos){				
				cPhotos+=obj.cPhotos[i]+",";
			}
			for(var i in obj.lables){
				lables+=obj.lables[i].id+","
			}
			lables=lables.substring(0,lables.length-1);
			cPhotos=cPhotos.substring(0,cPhotos.length-1);
			bPhotos=bPhotos.substring(0,bPhotos.length-1);			
		return $http({
        url:"/api-admin/base/product/add",
        method: 'post',
		headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"providerBrandId":obj.providerBrandId.id,			
				"brandId":obj.brandId.id,
				"name":obj.name,
				"shortName":obj.shortName,
				"onSell":obj.onSell,
				"canSell":true,
				"categoryId":obj.sortId.data.id,
				"bLogo":obj.bLogo[0],
				"cLogo":obj.cLogo[0],
				"bPhotos":bPhotos,
				"cPhotos":cPhotos,
				"terse":obj.terse,
				"detail":obj.detail,
				"labelIds":lables
			}
    })
    .then(function (data) {
         return data
    })
	}
	
	/**
	 * 修改商品
	 */
	function update(seid,obj){
		console.log(obj)
			var bPhotos="";
			var cPhotos="";
			var lables = "";			
			for(var i in obj.bPhotos){				
				bPhotos+=obj.bPhotos[i]+",";				
			}
			for(var i in obj.cPhotos){				
				cPhotos+=obj.cPhotos[i]+",";
			}
			for(var i in obj.labels){
				lables+=obj.labels[i].id+","
			}
			lables=lables.substring(0,lables.length-1);
			cPhotos=cPhotos.substring(0,cPhotos.length-1);
			bPhotos=bPhotos.substring(0,bPhotos.length-1);	
		return $http({
        url:"/api-admin/base/product/"+obj.id+"/update",
        method: 'post',
		headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"providerBrandId":obj.providerBrand.id,			
				"brandId":obj.brand.id,
				"name":obj.name,
				"shortName":obj.shortName,
				"onSell":obj.onSell,
				"canSell":obj.cancell,
				"categoryId":obj.categories.children[0].id,
				"bLogo":obj.bLogo,
				"cLogo":obj.cLogo,
				"bPhotos":bPhotos,
				"cPhotos":cPhotos,
				"terse":obj.terse,
				"detail":obj.detail,
				"labelIds":lables
			}
    })
    .then(function (data) {
         return data
    })
	}
	
	/**
	 * [dellist 删除商品]
	 * @param  {[type]} id   [商品ID]
	 * @param  {[type]} seid [sessionId]
	 * @return {[type]}      [json]
	 */
	function del(seid,id){
		return $http({
        url:"/api-admin/base/product/"+id+"/remove",
        method: 'post',
		headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        data:{"device":device,"version":version,"sessionId":seid}
    })
    .then(function (data) {
         return data
    })
	}
}
})();
(function(){
"use strict"
angular.module('index_area').controller('UpdateGoodCtrl',UpdateGoodCtrl);
UpdateGoodCtrl.$inject = ['$state','$rootScope','PublicResource','$stateParams','FormatResource','GoodResource','FileUploader',"SortResource","SupplierLogoResource","LabelResource","BrandStoresResource"];
/***调用接口***/
function UpdateGoodCtrl($state,$rootScope,PublicResource,$stateParams,FormatResource,GoodResource,FileUploader,SortResource,SupplierLogoResource,LabelResource,BrandStoresResource) {
    document.title ="商品详情";
    $rootScope.name="商品管理";
    $rootScope.childrenName="商品详情";
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.data;                //规格;

    vm.test = {name:"测试",id:1,sic:{name:1,id:2}}

    //获取商品id
    vm.id=$stateParams.id;
    console.log(vm.id)

    //获取sessionId

    vm.updateBtn = function(){
        console.log(vm.data)
        update();
    }

    login();
    init();
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

    gooddetail(vm.id)

    /*
     * 基本商品
     */
    function gooddetail(id){
        GoodResource.get(vm.seid,id).then(function(data){
            if(data.data.status!="OK"){
                layer.msg(data.data.message,{icon:1})
            }else{
                vm.data = data.data.result;
                arrayImage(vm.data)
            }
            console.log(vm.data)
        })
    }

    function arrayImage (data) {
        vm.data.cPhotos =data.cPhotos.split(",");
        vm.data.bPhotos =data.bPhotos.split(",");
        console.log(vm.data)
    }

    /**
	 * [bPhotos description]
	 * @type {[type]}
	 */
	var bPhotos = vm.bPhotos = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	bPhotos.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.bPhotos.queue) {
				vm.bPhotos.queue[i].isSuccess=false;
				vm.bPhotos.queue[i].isError=true;
                console.log(vm.bPhotos.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.bPhotos.push(status.result);
			 vm.bPhotos.queue[0].remove();
        }
	}
	bPhotos.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}

	/**
	 * [cPhotos description]
	 * @type {[type]}
	 */
	var cPhoto = vm.cPhotos = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]
	})

	cPhoto.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.cPhotos.queue) {
				vm.cPhotos.queue[i].isSuccess=false;
				vm.cPhotos.queue[i].isError=true;
                console.log(vm.cPhotos.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.cPhotos.push(status.result);
			 vm.cPhotos.queue[0].remove();
        }
	}
	cPhoto.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}



	/**
	 * bLogo
	 */
	 var bLogo = vm.bLogo = new FileUploader({
	 	url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}],
		queueLimit:1
	 })
	 bLogo.onSuccessItem = function (data,status) {
	 	 if(status.status!="OK"){
            for (var i in vm.bLogo.queue) {
				vm.bLogo.queue[i].isSuccess=false;
				vm.bLogo.queue[i].isError=true;
                console.log(vm.bLogo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.bLogo[0] = status.result;
			 vm.bLogo.queue[0].remove();
        }
	 }
	 bLogo.onErrorItem= function(){
		 vm.num = 5;
		 var time =setInterval(function () {
			 vm.num--;
			 console.log(11)
			 if(vm.num==0){
				 layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					 clearInterval(time);
					 return false;
				 });
			 }
		 },1200)
	 }
	/**
	 * cLogo
	 */
	 var cLogo = vm.cLogo = new FileUploader({
	 	url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}],
		queueLimit:1
	 })
	 cLogo.onSuccessItem = function (data,status) {
	 	 if(status.status!="OK"){
            for (var i in vm.cLogo.queue) {
				vm.cLogo.queue[i].isSuccess=false;
				vm.cLogo.queue[i].isError=true;
                console.log(vm.cLogo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.info.cLogo[0] = status.result;
			 vm.cLogo.queue[0].remove();
        }
	 }
	 cLogo.onErrorItem= function(){
		 vm.num = 5;
		 var time =setInterval(function () {
			 vm.num--;
			 console.log(11)
			 if(vm.num==0){
				 layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					 clearInterval(time);
					 return false;
				 });
			 }
		 },1200)
	 }

     function update(){
         GoodResource.update(vm.seid,vm.data).then(function(data){
             console.log(data);
             if(data.data.status=="OK"){
                 layer.msg('修改成功~',{icon:1});
             }else{
                 layer.msg(data.data.message,{icon:2})
             }
         })
     }

     function init(){
         SortResource.list(vm.seid,0,0).then(function(data){
             vm.sortlist = data.data.result;
             console.log(vm.sortlist)
         })

         SupplierLogoResource.list(vm.seid,0,0).then(function(data){
             vm.brandlist = data.data.result;
             console.log(vm.brandlist)
         })

         BrandStoresResource.list(vm.seid,0,0).then(function(data){
             vm.providerBrandlist = data.data.result;
             console.log(vm.providerBrandlist)
         })

         LabelResource.list(vm.seid).then(function(data){
             vm.labellist = data.data.result;
             console.log(vm.labellist)
         })
     }
}
})();
(function(){
"use strict"
/**
 * 标签管理功能API封装
 */
angular.module('index_area').factory('LabelResource', LabelResource);
LabelResource.$inject = ['$http','device','version'];
function LabelResource($http,device,version) {
    return {
        list:list,
        get:get,
        update:update,
        remove:remove,
        add:add
    };
    
    /**
	 * list
	 * 获取列表
	 */
    function list(seid,skip,limit,brandId){    	
       return $http.get("/api-admin/label/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit,"brandId":brandId}}).then(function(data){
            return data
        })
    }

    function get (seid,id) {
        return $http.get("/api-admin/label/"+id+"/get",{params:{"device":device,"version":version,"sessionId":seid}}).then(function(data){
            return data
        })
    }

    function update (seid,info) {
        return $http({
            url:"/api-admin/label/"+info.id+"/update",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,"name":info.name}
        })
        .then(function (data) {
             return data
        })
    }

    function remove (seid,id) {
        return $http({
            url:"/api-admin/label/"+id+"/remove",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid}
        })
        .then(function (data) {
             return data
        })        
    }

    function add (seid,info) {   
        console.log(info)     
        return $http({
            url:"/api-admin/label/add",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"name":info.name,"brandId":info.brand.id}
        })
        .then(function (data) {
             return data
        })       
    }
}
})();
(function(){
"use strict"
angular.module('index_area').controller('LabellistCtrl',LabellistCtrl);
LabellistCtrl.$inject = ['$scope','$state','$rootScope','PublicResource','LabelResource','$stateParams','BrandStoresResource','NgTableParams'];
/***调用接口***/
function LabellistCtrl($scope,$state,$rootScope,PublicResource,LabelResource,$stateParams,BrandStoresResource,NgTableParams) {
    document.title ="标签管理";
	$rootScope.name="标签管理";
	$rootScope.childrenName="标签管理列表";
    var vm = this;
	vm.skip = 0
	vm.limit = 12;
	vm.seid
    vm.pageint=1;															//当前分页导航
	vm.list;
    
	//获取sessionId
	login()
	function login(){
		vm.user=PublicResource.seid("admin");			
		if(typeof(vm.user)=="undefined"){
			layer.msg("尚未登录！",{icon:2},function(index){
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
    
	vm.updateBtn = function(data){
		console.log(data)
		if(data.status){
			data.status=false;
			if(update(data)){
				data.status=false;
			}
		}else{
			
			data.status=true;
		}
	}
	
	vm.addBtn = function(list){
		console.log(list)
		add(list);
	}

	vm.delBtn = function(id){
		layer.confirm('您确定要删除标签？', {
			  btn: ['确定','取消'] //按钮
		}, 
		function(){
			del(id)
		})
	}

    //查询标签列表
   list(vm.seid);
	logo()
 
	/**
	 * 标签集合
	 * @param {Object} seid
	 */
	function list(){
		 LabelResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
	    	vm.list=data.data.result.data;
			for(var i in vm.list){
				vm.list[i].status=false;
			}	  
	    	console.log(vm.list);
	    	vm.tableParams = new NgTableParams({},{dataset:vm.list});  	
	    })
	}

	/*
	 *获取连锁品牌
	 */
	function logo () {
		 BrandStoresResource.list(vm.seid,0,0).then(function (data) {
		 	vm.logolist = data.data.result.data;
		 	 console.log(vm.logolist)
		 }) 
	}

	/**
	 * 获取单个数据
	 * @param {Object} seid
	 */
	function get(id){		
		LabelResource.get(vm.seid,id).then(function(data){			
			vm.info = data.data.result;
			console.log(vm.info)
		})
	}
	function add (info) {
		console.log(info)
		 LabelResource.add(vm.seid,info).then(function(data){			
			if(data.data.status="OK"){
				layer.msg("添加成功~",{icon:1},function (index) {
					 list(vm.seid);
					 layer.closeAll();
				})
			}else {
				layer.msg(data.data.message,{icon:2})
			}
			console.log(vm.info)
		})  
	}

	function update (info) {
		  LabelResource.update(vm.seid,info).then(function(data){			
			if (data.data.status=="OK") {
				layer.msg('编辑成功~',{icon:1},function (index) {
					  list(vm.seid);
					  layer.closeAll();
				})
				return true;
			}else {
				layer.msg(data.data.message,{icon:2})
				return false;
			}
		})  
	}

	function del(id) {
		  LabelResource.remove(vm.seid,id).then(function(data){			
			if (data.data.status=="OK") {
				layer.msg('删除成功~',{icon:1},function (index) {
					  list(vm.seid);
					  layer.closeAll();
				})
			}else {
				layer.msg(data.data.message,{icon:2})
			}
		})  
	}
}

})();
(function(){
"use strict"
angular.module('index_area').config(config).controller('MarketListCtrl', MarketListCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider) {
    $stateProvider
        .state("task", {
            url: "/market/task",
            templateUrl: "Market/task.html",
            controller: 'taskCtrl as taskCtrl'
        })
        .state("updatetask", {
            url: "/market/updatetask/{id:string}",
            templateUrl: "Market/UpdateTask.html",
            controller: 'UpdateTaskCtrl as UpdateTaskCtrl'
        })
}
MarketListCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource'];
function MarketListCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource) {
    document.title = "运营活动列表";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "运营活动列表"
    var vm = this;
    vm.idClass = false;
    vm.seid;
    login();
    list();
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", {
                icon: 2
            }, function (index) {
                layer.close(index);
                PublicResource.Urllogin() ;
            });
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }
    function list() {
        MarketResource.list(vm.seid, 0, 0).then(function (data) {
            console.log(data.data.result)
            vm.list = data.data.result;
            for (var i in vm.list) {
                vm.list[i].startTime = chang_time(new Date(vm.list[i].startTime));
                if (vm.list[i].endTime != null) {
                    vm.list[i].endTime = chang_time(new Date(vm.list[i].endTime));
                }
            }
            vm.markList = new NgTableParams({}, { dataset: vm.list });
        })
    }

    vm.TypeBtn = function (data) {
        vm.task.productType = data;

    }

    function chang_time(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        console.log(h.length);
        if (D.length < 3) {
            D = "0" + D;
        }
        console.log(D.length + ',' + D);
        if (m.length < 3) {
            m = "0" + m;
        }

        if (s < 9) {
            s = "0" + s;
        }
        return Y + M + D;
    }

}
})();
(function(){
"use strict"
angular.module('index_area').factory('MarketResource', MarketResource);
MarketResource.$inject = ['$http', 'device', 'version'];
function MarketResource($http, device, version) {
  return {
		  list: list,
    add: add,
    get: get,
    update: update,
    remove: remove
  };

  function list(seid, skip, limit) {
    return $http.get("/api-admin/promotion/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
      return data
    })
  }

  function get(seid, id) {
    return $http.get("/api-admin/promotion/get", { params: { "device": device, "version": version, "sessionId": seid, 'id': id } }).then(function (data) {
      return data
    })
  }

  function update(seid, obj) {
    return $http({
      url: "/api-admin/promotion/update",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "id":obj.id,
        "name": obj.name,                               //活动名称
        "description": obj.description,                 //活动描述
        "startTime": obj.startTime,                     //开始时间
        "endTime": obj.endTime,                         //结束时间
        "storeType": obj.storeType,                     //门店类型
        "storeIds": obj.storeIds,                       //门店id
        "userType": obj.userType,                       //用户类型
        "timesLimitCycle": obj.timesLimitCycle,          //周期天数
        "productType": obj.productType,
        "productIds": obj.productIds,
        "timesLimitType": obj.timesLimitType,
        "timesLimit": obj.timesLimit,
        "amountLimit": obj.amountLimit,
        "extensibleCriteria": "",
        "enabled": obj.enabled,
        "exclusive": obj.exclusive,
        "priority": obj.priority,
        "type": obj.type,
        "formulaParameter": JSON.stringify(obj.formulaParameterMap)
      }
    })
      .then(function (data) {
        return data
      })
  }

  function add(seid, obj) {
    return $http({
      url: "/api-admin/promotion/add",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "name": obj.name,
        "description": obj.description,
        "startTime": obj.startTime,
        "endTime": obj.endTime,
        "storeType": obj.storeType,
        "storeIds": obj.storeIds,
        "userType": obj.userType,
        "timesLimitCycle": obj.timesLimitCycle,
        "productType": obj.productType,
        "productIds": obj.productIds,
        "timesLimitType": obj.timesLimitType,
        "timesLimit": obj.timesLimit,
        "amountLimit": obj.amountLimit,
        "extensibleCriteria": "",
        "enabled": obj.enabled,
        "exclusive": obj.exclusive,
        "priority": obj.priority,
        "type": obj.type,
        "formulaParameter": JSON.stringify(obj.formulaParameter)
      }
    })
      .then(function (data) {
        return data
      })
  }


  function remove(seid, id) {
    return $http({
      url: "/api-admin/promotion/remove",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "id": id
      }
    })
      .then(function (data) {
        return data
      })
  }

}
})();
(function(){
"use strict"
angular.module('index_area').controller('PromotionsCtrl',PromotionsCtrl);
PromotionsCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams'];
function PromotionsCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams){
    document.title ="商品促销列表";
    $rootScope.name="商品促销列表管理"
    $rootScope.childrenName="商品促销列表"
    var vm = this;
    vm.seid;
    login();
    list();

    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof(vm.user) == "undefined") {
        layer.alert("尚未登录！", {
            icon: 2
        }, function(index) {
            layer.close(index);
            PublicResource.Urllogin();
        });
        } else {
        vm.seid = PublicResource.seid(vm.user);
        }
    }
    function list(){
        
    }
}
})();
(function(){
"use strict"

})();
(function(){
"use strict"
angular.module('index_area').controller('UpdateTaskCtrl', UpdateTaskCtrl);
UpdateTaskCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource', 'StoresResource', 'GoodResource'];
function UpdateTaskCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource, StoresResource, GoodResource) {
    document.title = "编辑运营活动";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "编辑运营活动"
    var vm = this;
    vm.id = $stateParams.id;
    vm.seid;
    vm.stores = new Object();
    vm.specs = new Array();
    vm.data = new Object();
    vm.data.formulaParameter = new Object();
    vm.data.productIds = "";
    vm.data.timesLimit = "";
    vm.data.amountLimit = ""
    vm.FilterStores = new Array();      //已选择门店
    vm.GoodSpecs = new Array();
    login();
    get(vm.id)
    vm.UpTask = function () {
        for (var i = 0; i < $('.date').length; i++) {

            vm.task[$('.date').eq(i).attr('name')] = $('.date').val();
        }
        vm.data.storeIds = ""
        if (vm.data.storeType == "SELECTED_STORE") {
            vm.data.storeIds = ArryString(vm.FilterStores, true)
        }
        if (vm.data.productType == 'SELECTED_PRODUCT') {
            vm.data.productIds = ArryString(vm.specs, false)
        }
        if (typeof (vm.data.startTime) != "undefined" && vm.data.startTime != "" && typeof (vm.data.startTime) != 'number') {
            console.log(typeof (vm.data.startTime))
            vm.data.startTime = vm.data.startTime.getTime();
        }
        if (typeof (vm.data.endTime) != "undefined" && vm.data.endTime != "" && typeof (vm.data.endTime) != 'number') {
            console.log(vm.data.endTime)
            vm.data.endTime = vm.data.endTime.getTime();
        }
        console.log(vm.data);
        MarketResource.update(vm.seid, vm.data).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg("保存成功", { icon: 1 })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    //添加门店
    vm.AddStores = function (list) {
        if (list.status) {
            vm.FilterStores.push(list)
            list.status = false;
            console.log(vm.FilterStores);
        }
    }

    //添加规格
    vm.AddSpecs = function (item) {
        if (item.status) {
            vm.specs.push(item)
            item.status = false;
        }
        vm.specList = new NgTableParams({}, { dataset: vm.specs });
    }

    //删除已选择门店
    vm.delStores = function (name) {
        if (name) {
            for(var i in vm.FilterStores){
                if(vm.FilterStores[i].name == name){
                    console.log(vm.FilterStores[i])
                    vm.FilterStores.splice(i,1);
                }
            }
        } else {
            for (var i in vm.FilterStores) {
                if (vm.FilterStores[i].check) {
                    console.log(vm.storesList[i])
                    vm.storesList[i].status = true;
                    vm.storesList[i].active = false;
                    vm.FilterStores.splice(i, 1);
                    
                }
            }
        }

    }

    //删除已选择规格
    vm.delSpecs = function (i, id) {
        if (i) {
            for (var x in vm.GoodSpecs) {
                if (vm.GoodSpecs[x].spec.id == id) {
                    console.log(vm.specs[i])
                    console.log(vm.GoodSpecs[x])
                    vm.GoodSpecs[x].status = true;
                    vm.specs.splice(i, 1);
                    vm.specList = new NgTableParams({}, { dataset: vm.specs });
                }
            }
        } else {
            for (var i in vm.specs) {
                if (vm.specs[i].check) {
                    console.log(vm.specs[i])
                    for (var x in vm.GoodSpecs) {
                        if (vm.GoodSpecs[x].spec.id == vm.specs[i].spec.id) {
                            vm.GoodSpecs[x].status = true;
                        }
                    }
                    vm.specs.splice(i, 1);
                }
            }
            vm.specList = new NgTableParams({}, { dataset: vm.specs });
        }
    }

    //全选事件
    vm.All = function (is) {
        switch (is) {
            case 'AddStore':
                for (var i in vm.storesList) {
                    if (vm.storesList[i].active) {
                        vm.storesList[i].active = false;
                    } else {
                        vm.storesList[i].active = true;
                    }
                }
                break;
            case 'DelStore':
                for (var i in vm.FilterStores) {
                    if (vm.FilterStores[i].check) {
                        vm.FilterStores[i].check = false;
                    } else {
                        vm.FilterStores[i].check = true;
                    }
                }
                break;
            case 'AddSpecs':
                for (var i in vm.GoodSpecs) {
                    if (vm.GoodSpecs[i].active) {
                        vm.GoodSpecs[i].active = false;
                    } else {
                        vm.GoodSpecs[i].active = true;
                    }
                }
                break;
            case 'DelSpecs':
                for (var i in vm.specs) {
                    if (vm.specs[i].check) {
                        vm.specs[i].check = false;
                    } else {
                        vm.specs[i].check = true;
                    }
                }
                break;
        }
    }

    //删除所有
    vm.delAll = function () {
        for (var i in vm.FilterStores) {
            vm.FilterStores[i].check = true;
        }
    }

    //添加门店
    vm.TopStore = function () {
        for (var i in vm.storesList) {
            if (vm.storesList[i].active) {
                vm.FilterStores.push(vm.storesList[i])
                vm.storesList[i].status = false;
                vm.storesList[i].active = false;
            }
        }
    }

    //添加所有规格
    vm.SpecsAll = function () {
        for (var i in vm.GoodSpecs) {
            if (vm.GoodSpecs[i].active) {
                vm.specs.push(vm.GoodSpecs[i])
                vm.GoodSpecs[i].status = false;
                vm.GoodSpecs[i].active = false;
            }
        }
        vm.specList = new NgTableParams({}, { dataset: vm.specs });
    }


    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", {
                icon: 2
            }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            });
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }
    stores();
    //门店列表
    function stores() {
        StoresResource.list(vm.seid, 0, 0).then(function (data) {
            vm.storesList = data.data.result.data
            for (var i in vm.storesList) {
                vm.storesList[i].status = true;
            }
            vm.StroesList = new NgTableParams({}, { dataset: vm.storesList });
        })
    }
    good()
    //商品列表
    function good() {
        GoodResource.list(vm.seid, null, 0, 0).then(function (data) {
            vm.good = data.data.result.data;
            // console.log(vm.good)
            ArryAnalysis(vm.good)
            // vm.GoodList = new NgTableParams({},{dataset:vm.good});
        })
    }

    //商品列表加工
    function ArryAnalysis(obj) {
        var good = new Object();
        good.categories = new Object();
        for (var i in obj) {
            for (var j in obj[i].specs) {
                good.name = obj[i].name;
                good.categories.children = obj[i].categories.children[0].data;
                good.categories.data = obj[i].categories.data;
                good.providerBrand = obj[i].providerBrand;
                good.spec = obj[i].specs[j]
                good.status = true;
                vm.GoodSpecs.push(good);
                good = new Object();
                good.categories = new Object();
            }
        }
        vm.GoodList = new NgTableParams({}, { dataset: vm.GoodSpecs });
    }

    //将已选择的门店或者商品规格提取id为字符串链接
    function ArryString(obj, status) {
        console.log(obj);
        var StoreArry = "";
        if (status) {
            for (var i in obj) {
                StoreArry += obj[i].id + ","
            }
        } else {
            for (var i in obj) {
                console.log(obj[i])
                StoreArry += obj[i].spec.id + ","
            }
        }
        StoreArry = StoreArry.substring(0, StoreArry.length - 1)
        return StoreArry
    }

    //获取运营数据
    function get(id) {
        MarketResource.get(vm.seid, id).then(function (data) {
            vm.data = data.data.result;
            for (var i in vm.data.promotionStoreList) {
                vm.FilterStores.push(vm.data.promotionStoreList[i])
                vm.data.promotionStoreList[i].status = false;
            }
            for (var i in vm.data.promotionProductList) {
                vm.specs.push(vm.data.promotionProductList[i])
                vm.data.promotionProductList[i].status = false;
            }
            vm.specList = new NgTableParams({}, { dataset: vm.specs });
            console.log(vm.data)
        })
    }

}
})();
(function(){
"use strict"
angular.module('index_area').controller('taskCtrl',taskCtrl);
taskCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','MarketResource','StoresResource','GoodResource'];
function taskCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,MarketResource,StoresResource,GoodResource){
    document.title ="新建运营活动";
    $rootScope.name="运营管理"
    $rootScope.childrenName="新建运营活动"
    var vm = this;
    vm.seid;
    vm.stores = new Object();
    vm.specs = new Array();

    vm.task = new Object();
    vm.task.formulaParameter = new Object();
    vm.task.productIds="";
    vm.task.timesLimit="";
    vm.task.amountLimit=""
    vm.FilterStores = new Array();      //已选择门店
    vm.GoodSpecs = new Array();
    login();

    vm.AddTask = function(){
        for(var i=0;i<$('.date').length;i++){

            vm.task[$('.date').eq(i).attr('name')] = $('.date').val();
        }
        vm.task.storeIds=""
        if(vm.task.storeType=="SELECTED_STORE"){
            vm.task.storeIds = ArryString(vm.FilterStores,true)
        }
        if(vm.task.exclusive){
            for(var i in vm.tasklist){
                
            }
        }
        if(vm.task.productType=='SELECTED_PRODUCT'){
            vm.task.productIds = ArryString(vm.specs,false)
        }
        if(typeof(vm.task.startTime)!="undefined"&&vm.task.startTime!=""&&typeof(vm.task.startTime)!='number'){
            console.log(typeof(vm.task.startTime))
            vm.task.startTime = vm.task.startTime.getTime();
        }
        if(typeof(vm.task.endTime)!="undefined"&&vm.task.endTime!=""&&typeof(vm.task.endTime)!='number'){
            console.log(vm.task.endTime)
            vm.task.endTime = vm.task.endTime.getTime();
        }
        console.log(vm.task);
         MarketResource.add(vm.seid,vm.task).then(function(data){
            if(data.data.status=="OK"){
                layer.msg("保存成功",{icon:1})
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    //
    vm.AddStores = function(list){
        if(list.status){
            vm.FilterStores.push(list)
            list.status=false;
            console.log(vm.FilterStores);
        }
    }

    //
    vm.AddSpecs = function(item){
        if(item.status){
            vm.specs.push(item)
            item.status=false;
        }
            vm.specList = new NgTableParams({},{dataset:vm.specs}); 
    }

    vm.taskBtn = function(){
        console.log(vm.task)
    }

    //删除已选择门店
    vm.delStores = function(i){
        if(i){
            vm.FilterStores.splice(i,1)
            vm.storesList[i].status=true;
        }else{
            for(var i in vm.FilterStores){
                if(vm.FilterStores[i].check){
                    console.log(vm.storesList[i])
                    vm.storesList[i].status=true;
                    vm.storesList[i].active=false;
                    vm.FilterStores.splice(i,1);
                }
            }
        }
        
    }

    //删除已选择规格
    vm.delSpecs = function(i,id){
       if(i){
           for(var x in vm.GoodSpecs){
                if(vm.GoodSpecs[x].spec.id ==id){
                        console.log(vm.specs[i])
                        console.log(vm.GoodSpecs[x])
                        vm.GoodSpecs[x].status=true;
                        vm.specs.splice(i,1);
                        vm.specList = new NgTableParams({},{dataset:vm.specs});
                    }
            }
       }else{
           for(var i in vm.specs){
                if(vm.specs[i].check){
                    console.log(vm.specs[i])
                    for(var x in vm.GoodSpecs){
                        if(vm.GoodSpecs[x].spec.id==vm.specs[i].spec.id){
                            vm.GoodSpecs[x].status=true;
                        }
                    }
                    vm.specs.splice(i,1);
                }
            }
            vm.specList = new NgTableParams({},{dataset:vm.specs});
       }
    }

    vm.All = function(is){
        switch(is){
            case 'AddStore':
                for(var i in vm.storesList){
                        if(vm.storesList[i].active){
                            vm.storesList[i].active=false;
                        }else{
                            vm.storesList[i].active=true;
                        }
                    }
            break;
            case 'DelStore':
                for(var i in vm.FilterStores){
                        if(vm.FilterStores[i].check){
                            vm.FilterStores[i].check=false;
                        }else{
                            vm.FilterStores[i].check=true;
                        }
                    }
            break;
            case 'AddSpecs':
                for(var i in vm.GoodSpecs){
                        if(vm.GoodSpecs[i].active){
                            vm.GoodSpecs[i].active=false;
                        }else{
                            vm.GoodSpecs[i].active=true;
                        }
                    }
            break;
            case 'DelSpecs':
                for(var i in vm.specs){
                        if(vm.specs[i].check){
                            vm.specs[i].check=false;
                        }else{
                            vm.specs[i].check=true;
                        }
                    }
            break;
        }
    }

    vm.delAll = function(){
         for(var i in vm.FilterStores){
            vm.FilterStores[i].check=true;
        }
    }

    vm.TopStore = function(){
        for(var i in vm.storesList){
            if(vm.storesList[i].active){
                vm.FilterStores.push(vm.storesList[i])
                vm.storesList[i].status=false;
                vm.storesList[i].active=false;
            }
        }
    }

    vm.SpecsAll = function(){
        for(var i in vm.GoodSpecs){
            if(vm.GoodSpecs[i].active){
                vm.specs.push(vm.GoodSpecs[i])
                vm.GoodSpecs[i].status=false;
                vm.GoodSpecs[i].active=false;
            }
        }
        vm.specList = new NgTableParams({},{dataset:vm.specs});
    }


    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof(vm.user) == "undefined") {
        layer.alert("尚未登录！", {
            icon: 2
        }, function(index) {
            layer.close(index);
            PublicResource.Urllogin();
        });
        } else {
        vm.seid = PublicResource.seid(vm.user);
        }
    }
    stores();
    function stores(){
        StoresResource.list(vm.seid,0,0).then(function(data){
            vm.storesList = data.data.result.data
            for (var i in vm.storesList) {
                vm.storesList[i].status=true;
            }
            vm.StroesList = new NgTableParams({},{dataset:vm.storesList});   
        })
    }
    tasklist();
    function tasklist(){
        MarketResource.list(vm.seid,0,0).then(function(data){
            vm.tasklist = data.data.result;
            console.log(vm.tasklist)
        })
    }

    good()
    function good(){
        GoodResource.list(vm.seid,null,0,0).then(function(data){
            vm.good = data.data.result.data;
            // console.log(vm.good)
            ArryAnalysis(vm.good)
            // vm.GoodList = new NgTableParams({},{dataset:vm.good});
        })
    }

    function ArryAnalysis(obj){
        var good = new Object();
        good.categories = new Object();
        for(var i in obj){
            for(var j in obj[i].specs){
                good.name = obj[i].name;
                good.categories.children = obj[i].categories.children[0].data;
                good.categories.data = obj[i].categories.data;
                good.providerBrand=obj[i].providerBrand;
                good.spec = obj[i].specs[j]
                good.status = true;
                vm.GoodSpecs.push(good);
                good = new Object();
                good.categories = new Object();
            }
        }
        vm.GoodList = new NgTableParams({},{dataset:vm.GoodSpecs});
    }

    function ArryString(obj,status){
        console.log(obj);
        var StoreArry="";
        if(status){
            for(var i in obj){
                StoreArry+=obj[i].id+","
            }
        }else{
            for(var i in obj){
                StoreArry+=obj[i].spec.id+","
            }
        }
        StoreArry =  StoreArry.substring(0,StoreArry.length-1)
        return StoreArry
    }

}
})();
(function(){
"use strict"

})();
(function(){
"use strict"
angular.module('index_area').controller('AddMusicCtrl', AddMusicCtrl);
AddMusicCtrl.$inject = ['$rootScope', '$state', 'PublicResource', "$stateParams", 'StoresResource', 'NgTableParams','MusicResource'];
/***调用接口***/
function AddMusicCtrl($rootScope, $state, PublicResource, $stateParams, StoresResource, NgTableParams,MusicResource) {
    document.title = "语音推送管理";
    $rootScope.name = "语音推送管理";
    $rootScope.childrenName = "语音推送管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.music = new Object();
    vm.music.dates = new Array();
    vm.music.store = new Array();
    vm.music.times = new Array();
    vm.stores;
    //获取sessionId
    login()
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", { icon: 2 }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            })
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }


    //选择部分门店
    vm.Addstore = function (item) {
        if (item) {
            item.select = false;
            item.status = true;
            item.active = false;
            vm.music.store.push(item);
        } else {
            for (var i in vm.stores) {
                console.log(vm.stores[i])
                if (vm.stores[i].select == true) {
                    vm.stores[i].select = false;
                    vm.stores[i].status = true;
                    vm.stores[i].active = false;
                    vm.selectList.push(vm.stores[i])
                }
            }
        }
        vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
    }


    //删除所选门店
    vm.Delstore = function (index) {
        if (!index) {
            for (var i in vm.selectList) {
                if (vm.selectList[i].active) {
                    for (var j in vm.stores) {
                        if (vm.stores[j].id == vm.selectList[i].id) {
                            vm.stores[j].status = false;
                            vm.stores[j].select = true;
                        }
                    }
                    vm.selectList.splice(i, 1);
                }
            }

        } else {
            for (var i in vm.stores) {
                if (vm.stores[i].id == vm.music.store[index].id) {
                    vm.stores[i].status = false;
                    vm.stores[i].select = true;
                }
            }
            vm.music.store.splice(index, 1)
        }

        vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
    }


    Stores();
    function Stores() {
        StoresResource.list(vm.seid, 0, 0).then(function (data) {
            vm.stores = data.data.result.data;
            for (var i in vm.stores) {
                vm.stores[i].select = true;
                vm.stores[i].status = false;
            }
            vm.tableStores = new NgTableParams({}, { dataset: vm.stores });
        })
    }
    vm.add = function () {
        startAdd();
        addData();
        console.log(vm.music)
    }

    vm.addDates = function () {
        var addlist = {
            startDate: "",
            endDate: ""
        }
        vm.music.dates.push(addlist)
        console.log(vm.music.dates)
    }
    vm.addTimes = function () {
        var addlist = {
            startTime: "11:20",
            endTime: "12:20"
        }
        vm.music.times.push(addlist)
        console.log(vm.music.dates)
    }

    function startAdd(){
        vm.music.storeId="";
        for(var i in vm.music.dates){
            if(typeof(vm.music.dates[i].startDate)!="number"){
                vm.music.dates[i].startDate=vm.music.dates[i].startDate.getTime();
            }
            if(typeof(vm.music.dates[i].endDate)!="number"){
                vm.music.dates[i].endDate=vm.music.dates[i].endDate.getTime();
            }
        }

        for(var i in vm.music.store){
            vm.music.storeId+=vm.music.store[i].id+","
        }
        vm.music.storeId = vm.music.storeId.substring(0,vm.music.storeId.length-1);
    }

    function addData(){
        MusicResource.add(vm.seid,vm.music).then(function(data){
            console.log(data)
            if(data.data.status=="OK"){
                layer.msg('保存成功~',{incon:1},function(){
                    $state.go('/music/list')
                });                
            }else{
                layer.msg(data.data.message,{icom:2})
            }
        })
    }

}

})();
(function(){
"use strict"
angular.module('index_area').factory('MusicResource', MusicResource);
MusicResource.$inject = ['$http','device','version'];
function MusicResource($http,device,version) {
    return {
		list:list,
        add:add,
        update:update,
        remove:remove,
        get:get
    };

      function list(seid,skip,limit){
          return $http.get("/api-admin/voice/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
        return data
      })
      }

      function get(seid,id,skip,limit){
          return $http.get("/api-admin/voice/get",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit,"voiceId":id}}).then(function(data){
        return data
      })
      }

      function add(seid,obj){
           return $http({
            url:"/api-admin/voice/add",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "name":obj.name,
                "effective":obj.effective,
                "type":obj.type,
                "content":obj.content,
                "allStore":obj.allStore,
                "storeIds":obj.storeId,
                "dates":JSON.stringify(obj.dates),
                "times":JSON.stringify(obj.times),
                "formulaParameter":obj.formulaParameter
              }
        })
        .then(function (data) {
            return data
        })
      }

      function update(seid,obj){
           return $http({
            url:"/api-admin/voice/update",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "name":obj.name,
                'id':obj.id,
                "effective":obj.effective,
                "type":obj.type,
                "content":obj.content,
                "allStore":obj.allStore,
                "storeIds":obj.storeId,
                "dates":JSON.stringify(obj.voiceDates),
                "times":JSON.stringify(obj.voiceTimes)
              }
        })
        .then(function (data) {
            return data
        })
      }

       function remove(seid,ids){
           return $http({
            url:"/api-admin/voice/remove",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "ids":ids
              }
        })
        .then(function (data) {
            return data
        })
      }
    
}
})();
(function(){
"use strict"
angular.module('index_area').config(config).controller('MusicListCtrl',MusicListCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider){
    $stateProvider
    .state("mucadd", {
        url: "/music/addmusic",
        templateUrl: "Music/AddMusic.html",
        controller: 'AddMusicCtrl as AddMusicCtrl'
    })
    .state("mucupdate", {
        url: "/music/updatemusic/{id:string}",
        templateUrl: "Music/UpdateMusic.html",
        controller: 'UpdateMusicCtrl as UpdateMusicCtrl'
    })
}
MusicListCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams','MusicResource'];
/***调用接口***/
function MusicListCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams,MusicResource) {
    document.title ="语音推送管理";
    $rootScope.name="语音推送管理";
    $rootScope.childrenName="语音推送管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.getinfo;

    //获取sessionId
    login()
    list();
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

    vm.delBtn = function(id){
        layer.confirm('您确定要删除语音？', {
				btn: ['确定','取消'] //按钮
		}, function(){
			    del(id);
		});
    }

    function list(){
        MusicResource.list(vm.seid,0,0).then(function(data){            
            vm.list = data.data.result.data;
            for(var i in vm.list){
                for(var j in vm.list[i].voiceDates){
                    vm.list[i].voiceDates[j].endDate = chang_time(new Date(vm.list[i].voiceDates[j].endDate));
                    vm.list[i].voiceDates[j].startDate = chang_time(new Date(vm.list[i].voiceDates[j].startDate));
                }
            }
            console.log(vm.list)
        })
    }

    function chang_time(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        if (D.length < 3) {
        D = "0" + D;
        }
        if (m.length < 3) {
        m = "0" + m;
        }

        if (s < 9) {
        s = "0" + s;
        }
        return Y + M + D;
    }

    function del(id){
        MusicResource.remove(vm.seid,id).then(function(data){
            if(data.data.status =="OK"){
                layer.msg('删除成功',{icon:1});
                list();
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

}

})();
(function(){
"use strict"
angular.module('index_area').controller('UpdateMusicCtrl', UpdateMusicCtrl);
UpdateMusicCtrl.$inject = ['$rootScope', '$state', 'PublicResource', "$stateParams", 'StoresResource', 'NgTableParams', 'MusicResource'];
/***调用接口***/
function UpdateMusicCtrl($rootScope, $state, PublicResource, $stateParams, StoresResource, NgTableParams, MusicResource) {
    document.title = "语音推送管理";
    $rootScope.name = "语音推送管理";
    $rootScope.childrenName = "修改语音推送";
    var vm = this;
    vm.seid
    vm.stores;						//对象集合
    vm.getinfo;
    vm.selectList = new Array();
    vm.id = $stateParams.id;
    console.log(vm.id)
    //获取sessionId
    login()
    stores();
    get(vm.id)
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", { icon: 2 }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            })
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }

    //选择部分门店
    vm.Addstore = function (item) {
        if (item) {
            item.select = false;
            item.status = true;
            item.active = false;
            vm.music.store.push(item);
        } else {
            for (var i in vm.stores) {
                console.log(vm.stores[i])
                if (vm.stores[i].select == true) {
                    vm.stores[i].select = false;
                    vm.stores[i].status = true;
                    vm.stores[i].active = false;
                    vm.selectList.push(vm.stores[i])
                }
            }
        }
        vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
    }


    //删除所选门店
    vm.Delstore = function (index) {
        if (!index) {
            for (var i in vm.selectList) {
                if (vm.selectList[i].active) {
                    for (var j in vm.stores) {
                        if (vm.stores[j].id == vm.selectList[i].id) {
                            vm.stores[j].status = false;
                            vm.stores[j].select = true;
                        }
                    }
                    vm.selectList.splice(i, 1);
                }
            }

        } else {
            for (var i in vm.stores) {
                if (vm.stores[i].id == vm.music.store[index].id) {
                    vm.stores[i].status = false;
                    vm.stores[i].select = true;
                }
            }
            vm.music.store.splice(index, 1)
        }

        vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
    }


    //提交修改资料
    vm.updata = function () {
        endUpdate();
        console.log(vm.music);
        update()
    }

    function endUpdate(){
        vm.music.storeId="";
        for(var i in vm.music.voiceDates){
            if(typeof(vm.music.voiceDates[i].startDate)!="number"){
                vm.music.voiceDates[i].startDate=vm.music.voiceDates[i].startDate.getTime();
            }
            if(typeof(vm.music.voiceDates[i].endDate)!="number"){
                vm.music.voiceDates[i].endDate=vm.music.voiceDates[i].endDate.getTime();
            }
        }

        for(var i in vm.music.store){
            vm.music.storeId+=vm.music.store[i].id+","
        }
        vm.music.storeId = vm.music.storeId.substring(0,vm.music.storeId.length-1);
    }

    vm.addDates = function () {
        var addlist = {
            startDate: "",
            endDate: ""
        }
        vm.music.voiceDates.push(addlist)
    }
    vm.addTimes = function () {
        var addlist = {
            startTime: "11:20",
            endTime: "12:20"
        }
        vm.music.voiceTimes.push(addlist)
    }

    function get(id) {
        MusicResource.get(vm.seid,id).then(function (data) {
            vm.music = data.data.result;
            console.log(vm.music)
            vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
        })
    }

    function stores() {
        StoresResource.list(vm.seid, 0, 0).then(function (data) {
            vm.stores = data.data.result.data;
            for (var i in vm.stores) {
                vm.stores[i].select = true;
                vm.stores[i].status = false;
            }
            vm.tableStores = new NgTableParams({}, { dataset: vm.stores });
            console.log(vm.stores);
            Ifstore(vm.stores, vm.music.store)
        })
    }

    function update() {
        MusicResource.update(vm.seid,vm.music).then(function (data) {
           if(data.data.status=="OK"){
               console.log(data)
               layer.msg('保存成功~',{icon:1},function(){
                   $state.go('/music/list')
               })
           }else{
               layer.msg(data.data.message,{icon:2})
           }
        })
    }

    function chang_time(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        console.log(h.length);
        if (D.length < 3) {
            D = "0" + D;
        }
        console.log(D.length + ',' + D);
        if (m.length < 3) {
            m = "0" + m;
        }

        if (s < 9) {
            s = "0" + s;
        }
        return Y + M + D;
    }

    function Ifstore(a, b) {
        console.log(vm.stores);
        for (var i in a) {
            for (var j in b) {
                if (a[i].id == b[j].id) {
                    vm.stores[i].status = true;
                    vm.stores[i].active = false;
                    vm.stores[i].select = false;
                }
            }
        }
    }

    function dateTime(data) {
        if (data == null || data.length < 1) {
            return false;
        }
        console.log(data)
        var date = data.split('-');
        console.log(date);
        var time = new Date(date[0], date[1] - 1, date[2]).getTime();
        return time;
    }
}

})();
(function(){
"use strict"
/**
 * 提供功能API封装
 */
angular.module('index_area').factory('OrderResource', OrderResource);
OrderResource.$inject = ['$http','device','version'];
function OrderResource($http,device,version) {
    return {
        list:list,
        get:get,
        refund:refund,
        Statuslist:Statuslist
    };


    /**
     * list
     * 获取订单列表
     */
    function list(seid,obj,skip,limit){
        return $http.get("/api-admin/trade/list",
            {params:{"device":device,
                "version":version,
                "sessionId":seid,
                "skip":skip,
                "limit":limit,
                "takeNo":obj.id,
                "status":obj.status
            }}).then(function(data){
            return data
        })
    }

    /**
     * 获取某个分类
     */
    function get(seid,id){
        return $.ajax({
            type:"get",
            url:"/api-admin/trade/"+id+"/get",
            dataType:"json",
            data:{"device":device,"version":version,"sessionId":seid},
            async:false,
            success:function(response){
                console.log(response)
                return response.data;
            }
        });
    }

    //退款申请

    function refund(seid,id){
        return $http({
            url:"/api-admin/trade/update-to-refund-completed",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                  "tradeId":id,
                  "device":device,
                  "version":version,
                  "sessionId":seid
              }
        })
        .then(function (data) {
             return data;
        })
    }

    function Statuslist(seid,status,skip,limit){
        return $http.get("/api-admin/trade/list",
            {params:{"device":device,
                "version":version,
                "sessionId":seid,
                "skip":skip,
                "limit":limit,
                "status":status
            }}).then(function(data){
            return data
        })
    }    
}
})();
(function(){
"use strict"
angular.module('index_area').controller('OrderlistCtrl',OrderlistCtrl);
OrderlistCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','StoresResource','OrderResource','NgTableParams'];
/***调用接口***/
function OrderlistCtrl($state,$scope,PublicResource,$stateParams,$rootScope,StoresResource,OrderResource,NgTableParams) {
    document.title ="订单管理";
    $rootScope.name="订单管理";
	$rootScope.childrenName="订单管理列表";
    var vm = this;
    vm.stores;              //门店集合
    vm.list;
    vm.get = new Object();
    vm.filerPay=[
        {title:'微信公众号',id:'WECHAT_WEB'},  
        {title:'微信支付',id:'WECHAT_APP'},  
        {title:'支付宝网页',id:'ZHIFUBAO_WEB'},  
        {title:'支付宝应用',id:'ZHIFUBAO_APP'},  
        {title:'线下支付',id:null}
    ]
    //获取sessionId
     login();
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

    vm.St_order = function(){
        list();
    }

    list();

    function list(){
        OrderResource.list(vm.seid,vm.get,0,100).then(function(data){
            vm.list = data.data.result.data;
            vm.tableParams = new NgTableParams({},{dataset:vm.list});   
            vm.pagecount =data.data.result.total;            
            console.log(data);
            for(var i in vm.list){
                vm.list[i].createDate=change_time(vm.list[i].createDate);
               if(vm.list[i].endDate!=null){
                    vm.list[i].endDate = change_time(vm.list[i].endDate)
               }
            }
            console.log(vm.list);
        })
    }

    function change_time(nS){
        return  new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, "");
    }

    function update(status,id){
        OrderResource.update(vm.seid,status,id).then(function(data){
            console.log(data);
            if(data.data.status=="OK"){
                layer.alert('修改成功',{icon:1})
            }else{
                layer.alert(data.data.message,{icon:2})
            }
            list();
        })
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
        add:add,
        remove:remove,
        get:get,
        update:update
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
    function add(seid,obj){    	     
        return $http({
            url:"/api-admin/category/add",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"name":obj.name,"targetId":obj.id,"device":device,"version":version,"sessionId":seid,"position":"IN"}
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
    function update(seid,id,name){
         return $http({
            url:"/api-admin/category/"+id+"/update",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,"id":id,"name":name}
        })
        .then(function (data) {
             return data
        })
    }
    
    /**
     * 删除分类
     */
    function remove(seid,id){
         return $http({
            url:"/api-admin/category/"+id+"/remove",
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'post',
            data:{"device":device,"version":version,"sessionId":seid,"id":id,"name":name}
        })
        .then(function (data) {
             return data
        })
    }
    
    /**
     * 获取某个分类
     */
    function get(seid,id){
        return $http({
            url:"/api-admin/category/"+id+"/get",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,"id":id}
        })
        .then(function (data) {
             return data
        })
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
	vm.addinfo.id=1;
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
    
    //查询分类列表
   list(vm.seid);
    
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
				list(vm.seid);
			}else{
				layer.alert(data.data.message,{icon:2})
			}
		})
	}
	
	vm.updatebtn = function(){
		updatechildren(vm.updateid,vm.updatename);
	}
	
	//删除节点
	vm.del = function(id){
		layer.confirm('您确定要删除分类？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			remove(id)
		  
		});
	}
	
	vm.getlist = function(id){
		get(id)
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
	vm.toggle = function(item){
		console.log(item);
		if(item.status==1){
			item.status=0;
			vm.open=true;
		}else{
			item.status=1;
		}
	}

	vm.addbtn = function(data,is){	
		console.log(data);
		add(data)
	}

	/**
	 * 编辑
	 */
	vm.edit = function(data){
		if(data.isedit){
			data.isedit=false;
			data.btnName="编辑";
			update(data.data.id,data.data.name)
		}else{
			data.isedit=true;
			data.btnName="保存";
		}
	}

	/**
	 * 添加
	 */
	function add(datainfo){		
		console.log(datainfo)
		SortResource.add(vm.seid,datainfo).then(function(data){
			if(data.data.status=="OK"){
				layer.msg('添加成功',{icon:1});
			}else{
				layer.msg(data.data.message,{icon:2});
			}
			list(vm.seid);
		})
	}

	/**
	 * 修改
	 */
	function update(id,name){
		SortResource.update(vm.seid,id,name).then(function(data){
			console.log(data.data.result);
			if(data.data.status=="OK"){
				layer.msg("修改成功",{icon:1});
			}else{
				layer.msg(data.data.message,{icon:2});
			}
			list(vm.seid);
		})
	}

	/**
	 * 分类集合
	 * @param {Object} seid
	 */
	function list(seid){
		 SortResource.list(vm.seid).then(function(data){
	    	vm.list=data.data.result.root;
	    	for (var item in vm.list.children) {
	    		vm.list.children[item].status=0;
				vm.list.children[item].isedit=false;
				vm.list.children[item].btnName="编辑";
				for(var list in vm.list.children[item].children){
					vm.list.children[item].children[list].isedit=false;
					vm.list.children[item].children[list].btnName="编辑";
				}
	    	}
	    	console.log(vm.list)
	    })
	}

	/**
	 * 删除
	 */
	function remove(id){
		console.log(id);
		SortResource.remove(vm.seid,id).then(function(data){				
			if (data.data.status=="OK") {					
				layer.alert('删除成功~', {icon: 1});
				list(vm.seid);
			} else{
				layer.alert(data.data.message,{icon:2})
			}
			
		})
	}
	
	
}
})();
(function(){
"use strict"

})();
(function(){
"use strict"
angular.module('index_area').config(config).controller('StoreslistCtrl',StoreslistCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider){
    $stateProvider
    .state("Virtual", {
        url: "/stores/virtual{id:string}",
        templateUrl: "Stores/Virtual.html",
        controller: 'VirtualCtrl as VirtualCtrl'
    }).state("VirtualUpdate", {
        url: "/stores/virtualupdate{id:string}",
        templateUrl: "Stores/VirtualUpdate.html",
        controller: 'VirtualUpdateCtrl as VirtualUpdateCtrl'
    }).state("VirtualGet", {
        url: "/stores/VirtualGet{id:string}",
        templateUrl: "Stores/VirtualGet.html",
        controller: 'VirtualGetCtrl as VirtualGetCtrl'
    }).state("VirtualGood", {
        url: "/stores/VirtualGood{id:string}",
        templateUrl: "Stores/VirtualGood.html",
        controller: 'VirtualGoodCtrl as VirtualGoodCtrl'
    }).state("VirtualSort", {
        url: "/stores/VirtualGood{id:string}",
        templateUrl: "Stores/VirtualSort.html",
        controller: 'VirtualSortCtrl as VirtualSortCtrl'
    })
}
StoreslistCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams'];
/***调用接口***/
function StoreslistCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams) {
    document.title ="门店管理";
    $rootScope.name="门店管理";
    $rootScope.childrenName="门店管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.getinfo;
    vm.skip=0;
    vm.limit=10;
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

    list();

    vm.delBtn = function(id){
        layer.confirm('您确定要删除门店？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id)
        });
    }

    vm.openBtn = function(status,id){
        var title,calssName;
        switch(status){
            case 'add':
                title='新增门店信息';
                calssName='.add_list';
            break;
            case 'get':
                get(id);
                title='门店信息';
                calssName='.get_list';
                console.log(vm.getinfo)
            break;
            case 'update':
                title='修改门店信息';
                calssName='.update_list';
            break;
        }

        layer.open({
		  type: 1,
		  title:title,
		  area: ['440px', '515px'], //宽高
		  content:$(calssName)
		});
    }
    function get(id){
        StoresResource.get(vm.seid,id).then(function(data){ 
            vm.getinfo = data.result;
            console.log(vm.getinfo)
        })
    }

     
    function list(){
        // StoresResource.list(vm.seid,0,0).then(function(data){
        //     console.log(data.data.result);
        //     vm.list = data.data.result;
        //     console.log(vm.list.data)
        // })
        
        vm.tableParams = new NgTableParams({},{
            getData:function(params){
                vm.skip=10*(params.page()-1);
                return StoresResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
                    console.log(data.data.result);
                    params.total(data.data.result.total)
                    console.log(params.page())
                    return data.data.result.data;
                })
            }
        })
    }

    function add(){
        StoresResource.add(vm.seid,vm.info).then(function(data){
            console.log(data.data.result);
            if(data.data.status=="OK"){
                layer.msg('修改成功~',{icon:1})
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

    function update(){
        StoresResource.update(vm.seid,vm.info).then(function(data){
            console.log(data.data.result);
            if(data.data.status=="OK"){
                layer.msg('修改成功~',{icon:1})
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

    function remove(id){
        StoresResource.remove(vm.seid,id).then(function(data){
            console.log(data.data.result);
            vm.list = data.data.result;
            if(data.data.status=="OK"){
                layer.msg('删除成功~',{icon:1})
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

}
})();
(function(){
"use strict"
/**
 * 分类功能API封装
 */
angular.module('index_area').factory('StoresResource', StoresResource);
StoresResource.$inject = ['$http','device','version'];
function StoresResource($http,device,version) {
    return {
        list:list,
        add:add,
        remove:remove,
        get:get,
        update:update
    };


    /**
     * list
     * 获取门店列表
     */
    function list(seid,skip,limit){
        return $http.get("/api-admin/store/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
            return data
        })
    }

    /**
     * 添加门店
     */
    function add(seid,obj){
        console.log(obj)
        return $.ajax({
            type:"post",
            url:"/api-admin/store/add",
            async:false,
            dataType:"json",
            data:{"name":obj.name,
                "brandId":obj.brand.id,
                "longitude":obj.longitude,
                "latitude":obj.latitude,
                "location":obj.location,
                "areaId":obj.areas[3].id,
                "legalPerson":obj.legalPerson,
                "sort":obj.sort,
                "device":device,
                "version":version,
                "sessionId":seid,
                "type":obj.StoreType,
                "legalPersonTelephone":obj.legalPersonTelephone},
            success:function(response){
                return response.data;
            }
        });
    }

    /**
     * 修改门店
     * @param {Object} id
     * @param {Object} seid
     * @param {Object} name
     */
    function update(seid,obj){
        console.log(obj)
        return $http({
            url:"/api-admin/store/"+obj.id+"/update",
            method: 'post',
            params:{
                "name":obj.name,
                "terse":obj.terse,
                "longitude":obj.longitude,
                "latitude":obj.latitude,
                "location":obj.location,
                "areaId":obj.areas[3].id,
                "brandId":obj.brandId,
                "legalPerson":obj.legalPerson,
                "sort":obj.sort,
                "device":device,
                "version":version,
                "sessionId":seid,
                "type":obj.type,
                "legalPersonTelephone":obj.legalPersonTelephone
            }
        })
        .then(function (data) {
            return data
        })
    }

    /**
     * 删除分类
     */
    function remove(seid,id){
        return $http({
            url:"/api-admin/store/"+id+"/remove",
            method: 'post',
            params:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "id":id
            }
        })
        .then(function (data) {
            return data
        })
    }

    /**
     * 获取某个分类
     */
    function get(seid,id){
        return $.ajax({
            type:"get",
            async:false,
            dataType:'json',
            data:{"device":device,"version":version,"sessionId":seid},
            url:"/api-admin/store/"+id+"/get",
            success:function(data){
                return data
            }
        })
    }
}
})();
(function(){
"use strict"

})();
(function(){
"use strict"
angular.module('index_area').controller('VirtualCtrl',VirtualCtrl);
VirtualCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource','$stateParams','VirtualResourrce','NgTableParams'];
/***调用接口***/
function VirtualCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams,VirtualResourrce,NgTableParams) {
    document.title ="虚拟分类管理";
	$rootScope.name="门店管理";
	$rootScope.childrenName="虚拟分类管理列表";
    var vm = this;
    vm.storename="";
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.list;
    vm.info;
   
    vm.storeid = $stateParams.id;
    
    
    vm.delbtn = function(id,storeID){
        layer.confirm('您确定要删除分类？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id,storeID)
        });
    }
    //获取sessionId
    login();
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
    
    
   list(vm.storeid);
    
    function list(storeid){
    	VirtualResourrce.list(vm.seid,storeid,0,0).then(function(data){
            vm.list = data.data.result;
            vm.tableParams = new NgTableParams({},{dataset:vm.list.virtualCategories});
            console.log(vm.list.virtualCategories)
        })
    }
     
    function remove(id,storeid){    	
    	VirtualResourrce.remove(vm.seid,id).then(function(data){
            console.log(data)
        })
    }
}

})();
(function(){
"use strict"
angular.module('index_area').controller('VirtualGetCtrl',VirtualGetCtrl);
VirtualGetCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource','$stateParams','VirtualResourrce'];
/***调用接口***/
function VirtualGetCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams,VirtualResourrce) {
    document.title ="虚拟分类管理";
	$rootScope.name="门店管理";
	$rootScope.childrenName="虚拟分类管理列表";
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.list;
    vm.info;
    vm.storeid = $stateParams.storeid;
 
    vm.delbtn = function(id,storeID){
        layer.confirm('您确定要删除分类？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id,storeID)
        });
    }
    //获取sessionId
    login();
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
    
    
}

})();
(function(){
"use strict"
angular.module('index_area').controller('VirtualGoodCtrl',VirtualGoodCtrl);
VirtualGoodCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource','$stateParams','VirtualResourrce'];
/***调用接口***/
function VirtualGoodCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams,VirtualResourrce) {
    document.title ="虚拟分类管理";
	$rootScope.name="门店管理";
	$rootScope.childrenName="虚拟分类管理列表";
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.list;
    vm.info;
    vm.storeid = $stateParams.storeid;
 
    vm.delbtn = function(id,storeID){
        layer.confirm('您确定要删除分类？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id,storeID)
        });
    }
    //获取sessionId
    login();
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
    
    
}

})();
(function(){
"use strict"
/**
 * 虚拟分类API
 */
angular.module('index_area').factory('VirtualResourrce', VirtualResourrce);
VirtualResourrce.$inject = ['$http','device','version'];
function VirtualResourrce($http,device,version) {
    return {
		list:list,
		add:add,
		update:update,
		remove:remove,
		get:get
    };


	/**
	 * 虚拟分类列表
	 */
	function get(seid,storeId,id){
		 return $http.get("/api-admin/virtual/category/"+id+"/get",{params:{"device":device,"version":version,"sessionId":seid,"storeId":storeId}}).then(function(data){
            return data
        })
	}

	/**
	 * 添加基础商品
	 */
	function add(seid,obj){
		console.log(obj)
		var categoryId=new Object();
		categoryId.data = new Object();
		categoryId.data.id===null;
		console.log(categoryId.data.id)
		if(typeof(obj.sortId)=='undefined'||obj.sortId==""){
			categoryId =obj.sorts;
		}else{
			categoryId = obj.sortId;
		}
		if(categoryId==null){
			categoryId = new Object();
			categoryId.data = new Object();
		}
		var lables = "";
		for(var i in obj.lables){
			lables+=obj.lables[i].id+",";
		}
		lables=lables.substring(0,lables.length-1);
		return $http({
            url:"/api-admin/virtual/category/add",
            method: 'post',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"name":obj.name,
				"backgroundColor":obj.backgroundColor,
				"storeId":obj.storeid,
				"providerBrandIds":obj.providerBrandIds[0].id,
				"productCategoryIds":categoryId.data.id,
				"labelIds":lables,
				"sort":obj.sort,
				"parentId":obj.parentId,
				"showInPad":obj.showInPad
			}
        })
        .then(function (data) {
             return data
        })
	}


	function list(seid,storeid){
		 return $http.get("/api-admin/virtual/category/get",{params:{"device":device,"version":version,"sessionId":seid,"storeId":storeid}}).then(function(data){
            return data
        })
	}
	
	/**
	 * 修改商品
	 */
	function update(seid,obj){
		var labels = "";			
		for(var i in obj.labels){				
			labels+=obj.labels[i].id+",";				
		}
		labels=labels.substring(0,labels.length-1);	
		return $http({
            url:"/api-admin/virtual/category/"+obj.id+"/update",
            method: 'post',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"name":obj.name,
				"backgroundColor":obj.backgroundColor,
				"storeId":obj.storeId,				
				"providerBrandIds":obj.providerBrands[0].id,
				"productCategoryIds":obj.Categorys,
				"labelIds":labels,
				"sort":obj.sort,
				"parentId":obj.parentId,
				"showInPad":obj.showInPad
			},
        })
        .then(function (data) {
             return data
        })
	}
	
	/**
	 * 删除商品
	 */
	function remove(seid,id,storeid){
		return $http({
            url:"/api-admin/virtual/category/"+id+"/remove",
            method: 'post',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,"storeId":storeid}
        })
        .then(function (data) {
             return data
        })
	}
}
})();
(function(){
"use strict"
angular.module('index_area').controller('VirtualSortCtrl',VirtualSortCtrl);
VirtualSortCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource','$stateParams','VirtualResourrce'];
/***调用接口***/
function VirtualSortCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams,VirtualResourrce) {
    document.title ="虚拟分类管理";
	$rootScope.name="门店管理";
	$rootScope.childrenName="虚拟分类管理列表";
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.list;
    vm.info;
    vm.storeid = $stateParams.storeid;
 
    vm.delbtn = function(id,storeID){
        layer.confirm('您确定要删除分类？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id,storeID)
        });
    }
    //获取sessionId
    login();
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
    
    
}

})();
(function(){
"use strict"
angular.module('index_area').controller('VirtualUpdateCtrl',VirtualUpdateCtrl);
VirtualUpdateCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource','$stateParams','VirtualResourrce'];
/***调用接口***/
function VirtualUpdateCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams,VirtualResourrce) {
    document.title ="虚拟分类管理";
	$rootScope.name="门店管理";
	$rootScope.childrenName="虚拟分类管理列表";
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.list;
    vm.info;

    vm.storeid = $stateParams.storeid;
 
    vm.delbtn = function(id,storeID){
        layer.confirm('您确定要删除分类？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id,storeID)
        });
    }
    //获取sessionId
    login();
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
    
    
}

})();
(function(){
"use strict"
angular.module('index_area').controller('SupplierLogolistCtrl',SupplierLogolistCtrl);
SupplierLogolistCtrl.$inject = ['$scope','$state','$rootScope','NgTableParams','PublicResource','$stateParams','SupplierLogoResource','SortResource','FileUploader'];
/***调用接口***/
function SupplierLogolistCtrl($scope,$state,$rootScope,NgTableParams,PublicResource,$stateParams,SupplierLogoResource,SortResource,FileUploader) {
    document.title ="供应商品牌";
    $rootScope.name="供应商品牌";
    $rootScope.childrenName="供应商品牌列表";
    var vm = this;
    vm.seid;
    vm.skip=0;             //起始数据下标
    vm.limit=12;            //最大数据下标
    vm.list;
    vm.getlist = new Object();
    vm.sortlist = new Object();             //分类集合
    vm.infolist = new Object();            //数据集合；  
    
    login();


    /**add
	 * [logo description]
	 * @type {[type]}
	 */
	var logo = vm.logo = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	logo.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.logo.queue) {
				vm.logo.queue[i].isSuccess=false;
				vm.logo.queue[i].isError=true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.infolist.logo=status.result;
             vm.logo.queue[0].remove();
        }
	}
	logo.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}

     /**update
	 * [logo description]
	 * @type {[type]}
	 */
	var logos = vm.logos = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	logos.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.logo.queue) {
				vm.logos.queue[i].isSuccess=false;
				vm.logos.queue[i].isError=true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.getlist.logo=status.result;
             vm.logos.queue[0].remove();
        }
	}
	logos.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}

    
    /**
     * [opermask 开启遮罩层]
     * @param  {[type]} index [true as false 判断是修改还是新增]
     * @param  {[type]} id    [description]
     * @return {[type]}       [description]
     */
    vm.opermask = function(status,id){
        var title;
        var ClassName;    
        switch(status){
            case "add":
                title = "新增商品信息";
                ClassName = ".add_div"
            break;
            case "update":
                title = "修改商品信息";
                ClassName = ".update_div"
                get(id);
            break;
            case "get":
                title = "商品信息";
                ClassName = ".get_div"
                get(id);
            break;

            
        }
        layer.open({
            type: 1,
            title:title,
            area: ['440px',"500px"], //宽高
            content:$(ClassName)
        }); 
    }
    
    vm.getBtn = function(id){
    	get(id); 
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
    vm.updateBtn = function(){
        update();
    }

    vm.addBtn = function(){
        add();
    }

    vm.delopen = function(id){
        console.log(id)
        layer.confirm('您确定要删除数据？', {
              btn: ['确定','取消'] //按钮
        }, function(){
            remove(id);
        });
    }
      

     //查询分类列表
    list(vm.seid,vm.skip,vm.limit);

    
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
     * [sortlist 品牌分类集合]
     * @return {[type]} [description]
     */
    function sortlist(){
        SortResource.list(vm.seid).then(function(data){
            vm.sortlist = data.data.result.root
        })
    }

     /**
     * [infoget 查询单个品牌数据]
     * @param  {[type]} id [品牌ID]
     * @return {[type]}    [description]
     */
    function get(id){
        SupplierLogoResource.get(vm.seid,id).then(function(data){
            vm.getlist = data.result;
            console.log(vm.getlist)
        })
    }


    /**
     * [addinfo 新增供应商品牌]
     * @return {[type]} [description]
     */
    function add(){        
        SupplierLogoResource.add(vm.seid,vm.infolist).then(function(data){
             if(data.data.status=="OK"){
                layer.msg("保存成功~",{icon:1},function(){
                    layer.closeAll();
                     //查询分类列表
                    list(vm.seid,vm.skip,vm.limit);
                });                            
            }else{
                layer.msg(data.data.message,{icon: 0});
            }
        })
    }

    function remove(id){
       SupplierLogoResource.remove(vm.seid,id).then(function(data){
             if(data.status=="OK"){
                layer.msg("删除成功~",{icon:1},function(){
                    layer.closeAll();
                     //查询分类列表
                    list(vm.seid,vm.skip,vm.limit);
                });                            
            }else{
                layer.msg(data.data.message, {icon: 0});
            }
        }) 
    }

    /**
     * 供应商品牌集合
     * @param {Object} seid
     */
    function list(){
         SupplierLogoResource.list(vm.seid,vm.skip,vm.limit).then(function(data){            
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
    function update(){
        SupplierLogoResource.update(vm.seid,vm.getlist).then(function(data){
            if(data.data.status=="OK"){
                list(vm.seid,vm.skip,vm.limit);
                layer.msg("修改成功~",{icon:1},function(){
                     layer.closeAll();                    
                });                
            }else{
                layer.msg(data.data.message,{icon:0});
            }
        })
    }

}

})();
(function(){
"use strict"
angular.module('index_area').factory('SupplierLogoResource',SupplierLogoResource);
SupplierLogoResource.$inject = ['$http','device','version'];
function SupplierLogoResource($http,device,version) {
    return {
		list:list,
		get:get,
		add:add,
		update:update,
		remove:remove
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
	 * [get 获取单个数据]
	 * @param  {[type]} seid [sessionID]
	 * @param  {[type]} id   [数据ID]
	 * @return {[type]}      [description]
	 */
	function get(seid,id){		
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
	function add(seid,obj){
		return $http({
            url:"/api-admin/provider/brand/add",
            method:'post',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"name":obj.name,
				"logo":obj.logo,
				"sort":obj.sort,
				"serialPrefix":obj.serialPrefix
			}
        })
        .then(function (data) {
             return data
        })  
	}
	
	/**
	 * 修改商品
	 */
	function update(seid,obj){
		console.log(obj)
		return $http({
            url:"/api-admin/provider/brand/"+obj.id+"/update",
            method: 'post',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
				"device":device,
				"version":version,
				"sessionId":seid,
				"name":obj.name,
				"logo":obj.logo,
				"sort":obj.sort,
				"serialPrefix":obj.serialPrefix
			}
        })
        .then(function (data) {
             return data
        })  
	}
	
	/**
	 * 删除商品
	 */
	function remove(seid,id){
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
angular.module('index_area').directive('stores', function (NgTableParams) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			list: "=",
			returnlist:'='
		},
		templateUrl: 'Template/StoresSelect.html',
		link: function (scope, elem, attr) {
			for(var i in scope.list){
				scope.list[i].select=true;
				scope.list[i].status=false;
			}
			scope.returnlist = new Array();
			scope.tableParams = new NgTableParams({}, { dataset: scope.list });

			//添加门店
			scope.Add = function(item){
				if(item){
					item.select=false;
					item.status=true;
					item.active=false;
					scope.returnlist.push(item);
				}else{
					for(var i in scope.list){
						console.log(scope.list[i])
						if(scope.list[i].select==true){
							scope.list[i].select=false;
							scope.list[i].status=true;
							scope.list[i].active=false;
							scope.returnlist.push(scope.list[i])
						}
					}
				}
				scope.tableStores = new NgTableParams({},{dataset:scope.returnlist})
			}

			scope.All = function(is,item){
				console.log(is)
					switch(item){
							case "AddStore":
								for(var i in scope.list){
									if(is){
											scope.list[i].status=true;
									}else{
											scope.list[i].status=false;
									}
								}
							break;
							case "DelStore":
								for(var i in scope.returnlist){
									if(is){
										scope.returnlist[i].active=true;
									}else{
										scope.returnlist[i].active=false;
									}
								}
							break;
					}
			}

			scope.Del = function(index){
				if(!index){
					
					for(var i in scope.returnlist){
						if(scope.returnlist[i].active){
							console.log(scope.returnlist[i])							
							for(var j in scope.list){
								if(scope.list[j].id==scope.returnlist[i].id){
									scope.list[j].status=false;
									scope.list[j].select=true;
								}
							}
							scope.returnlist.splice(i,1);
						}
					}
					
				}else{
					for(var i in scope.list){
					if(scope.list[i].id==scope.returnlist[index].id){
							scope.list[i].status=false;
							scope.list[i].select=true;
						}
					}
				scope.returnlist.splice(index,1)
				}
				
				scope.tableStores = new NgTableParams({},{dataset:scope.returnlist})
			}

			

		}
	}
})

})();
(function(){
"use strict"
angular.module('index_area').factory('OperationResource', OperationResource);
OperationResource.$inject = ['$http','device','version'];
function OperationResource($http,device,version) {
    return {
      list:list,
      get:get,
      add:add,
      del:del
    };

    //获取操作列表
    function list(seid,skip,limit){
        return $http.get("/api-admin/authority/operation/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
          return data
        })
    }

    //获取角色下的操作
    function get(seid,id){
        return $http.get("/api-admin/authority/role/operation/list",{params:{"device":device,"version":version,"sessionId":seid,'roleId':id}}).then(function(data){
          return data
        })
    }

    function add(seid,obj){
      return $http({
            url:"/api-admin/authority/role/operation/add",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"roleId":obj.id,"operationCode":obj.code}
        })
        .then(function (data) {
             return data
        })
    }

    function del(seid,obj){
      return $http({
            url:"/api-admin/authority/role/operation/remove",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"roleId":obj.id,"operationCode":obj.code}
        })
        .then(function (data) {
             return data
        })
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
        user:user,
        Urllogin:Urllogin,
		getarea:getarea,
		logout:logout,
		RoleUser:RoleUser
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
	 * 获取user信息
	 * seid:当前sessionID
	 */
	function user(seid){
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
	
	function RoleUser(seid,userid){
		return $.ajax({
			type:"get",
			url:"/api-admin/authority/user/roles",
			async:false,
			data:{"sessionId":seid,"device":device,"version":version,"userId":userid},
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
	

	//退出
	function logout(seid){
		return $.ajax({
			type:"post",
			url:"/api-admin/session/logout",
			async:false,
			data:{"sessionId":seid,"device":device,"version":version},
			dataType:'json',
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


}
})();
(function(){
"use strict"
angular.module('index_area').controller('RoleListCtrl',RoleListCtrl);
RoleListCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','RoleResource','OperationResource'];
function RoleListCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,RoleResource,OperationResource){
    document.title ="角色管理";
    $rootScope.name="角色管理"
    $rootScope.childrenName="角色管理列表"
    var vm = this;
    vm.seid;
    vm.data = new Object();
    vm.addinfo = new Object();
    login();
    list();
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof(vm.user) == "undefined") {
        layer.alert("尚未登录！", {
            icon: 2
        }, function(index) {
            layer.close(index);
            PublicResource.Urllogin();
        });
        } else {
        vm.seid = PublicResource.seid(vm.user);
        }
    }

    vm.operBtn = function(id){
        vm.data.id = id;
        get(id);
        layer.open({
            title:'操作管理',
            type:1,
		    content:$('.operList')
        })
    }

    vm.statusBtn = function(status,code){
        vm.data.code=code;
        console.log(vm.data)
        if(status){
            add()
        }else{
            del()
        }
    }

    vm.upBtn = function(item){
        console.log(item);
        vm.addinfo.name = item.name;
        vm.addinfo.id = item.id;
        vm.is = false;
        layer.open({
            title:'编辑角色',
            type:1,
		    content:$('.addRole')
        })
    }

    vm.AddRole = function(){
        vm.is = true;
        layer.open({
            title:'编辑角色',
            type:1,
		    content:$('.addRole')
        })
    }

    vm.infoBtn = function(){
        if(vm.is){
            addRole();
        }else{
            updateRole();
        }
    }

    vm.delBtn = function(id){
        layer.confirm('是否删除角色？', {
            btn: ['确定','取消'] //按钮
            }, function(){
                delRole(id)
            });
    }

    function list(){
        RoleResource.list(vm.seid,0,0).then(function(data){
            if(data.data.status=="OK"){
                vm.list = data.data.result;
                vm.RoleList = new NgTableParams({},{dataset:vm.list});
                console.log(vm.list)
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })

        OperationResource.list(vm.seid,0,0).then(function(data){
            if(data.data.status=="OK"){
                vm.operList = data.data.result;
                console.log(vm.operList)
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function get(id){
       OperationResource.get(vm.seid,id).then(function(data){
           vm.info = data.data.result;
           for(var i in vm.operList){
               vm.operList[i].status=false;
               for(var j in vm.info){
                   if(vm.operList[i].code==vm.info[j].code){
                        vm.operList[i].status=true;
                   }
               }
           }
       })
    }

    function add(){
        console.log(vm.data)
        OperationResource.add(vm.seid,vm.data).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('添加成功',{icon:1});
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function del(id){
         OperationResource.del(vm.seid,id).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('删除成功',{icon:1});
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function addRole(){
        RoleResource.add(vm.seid,vm.addinfo).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('添加成功',{icon:1},function(){
                    layer.closeAll();
                    list();
                });
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function updateRole(){
         RoleResource.update(vm.seid,vm.addinfo).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('修改成功',{icon:1},function(){
                     layer.closeAll();
                    list();
                });
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function delRole(id){
         RoleResource.del(vm.seid,id).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('删除成功',{icon:1},function(){
                     layer.closeAll();
                    list();
                });
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }
}
})();
(function(){
"use strict"
angular.module('index_area').factory('RoleResource', RoleResource);
RoleResource.$inject = ['$http','device','version'];
function RoleResource($http,device,version) {
    return {
		list:list,
        get:get,
        add:add,
        update:update,
        del:del,
        addUser:addUser,
        delUser:delUser
    };

    function list(seid,skip,limit){
        return $http.get("/api-admin/authority/role/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
			return data
		})
    }

    function get(seid,id){
        return $http.get("/api-admin/authority/user/roles",{params:{"device":device,"version":version,"sessionId":seid,"userId":id}}).then(function(data){
			return data
		})
    }


    //角色添加用户
    function addUser(seid,userId,roleId){
        return $http({
            url:"/api-admin/authority/role/user/add",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,'userId':userId,'roleId':roleId}
        })
        .then(function (data) {
             return data
        })
    }

     //角色添加用户
    function delUser(seid,userId,roleId){
        return $http({
            url:"/api-admin/authority/role/user/remove",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,'userId':userId,'roleId':roleId}
        })
        .then(function (data) {
             return data
        })
    }

    function add(seid,obj){
        console.log(obj)
        return $http({
            url:"/api-admin/authority/role/add",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,'name':obj.name}
        })
        .then(function (data) {
             return data
        })
    }

    function update(seid,obj){
        return $http({
            url:"/api-admin/authority/role/update",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,'name':obj.name,'roleId':obj.id}
        })
        .then(function (data) {
             return data
        })
    }

    function del(seid,id){
        return $http({
            url:"/api-admin/authority/role/remove",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{"device":device,"version":version,"sessionId":seid,'roleId':id}
        })
        .then(function (data) {
             return data
        })
    }
}
})();
(function(){
"use strict"
angular.module('index_area').controller('UserListCtrl',UserListCtrl);
UserListCtrl.$inject = ['$rootScope','PublicResource','NgTableParams','RoleResource','$http'];
function UserListCtrl($rootScope,PublicResource,NgTableParams,RoleResource,$http){
    document.title ="角色管理";
    $rootScope.name="角色管理"
    $rootScope.childrenName="角色管理列表"
    var vm = this;
    vm.skip = 0;
    vm.limit = 50;
    vm.seid;

    vm.get = function(userId){
        vm.userId = userId;
        for(var i in vm.Rolelist){
            vm.Rolelist[i].status=false;
        }
        get(userId);
        layer.open({
            title:'权限管理',
            type:1,
		    content:$('.RoleDiv')
        })
    }

    vm.upBtn=function(){
        update();
};

    login();
    list();
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof(vm.user) == "undefined") {
        layer.alert("尚未登录！", {
            icon: 2
        }, function(index) {
            layer.close(index);
            PublicResource.Urllogin();
        });
        } else {
        vm.seid = PublicResource.seid(vm.user);
        }
    }
    vm.statusBtn = function(status,id){
        if(status){
            addUser(vm.userId,id);
        }else{
            delUser(vm.userId,id);
        }
    }

    function list(){
       /* UserResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
            if(data.data.status=="OK"){
                vm.list = data.data.result;
                vm.TableList = new NgTableParams({},{dataset:vm.list});
                console.log(vm.list)
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })*/
        vm.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 10, // count per page
            per_page:10
        }, {
            filterDelay: 300,
            getData: function(info) {
                return $http.get("/api-admin/user/list",{params:{"device":'2.0.0',"version":'PC',"sessionId":vm.seid,"skip":vm.skip,"limit":0}}).then(function(data){
                    console.log(data.data.result);
                    vm.skip +=vm.limit;
                    info.per_page=10;
                    info.total(1000);
                    return data.data.result
                })
            }
        });

        RoleResource.list(vm.seid,0,0).then(function(data){
            vm.Rolelist = data.data.result;
            console.log(vm.Rolelist)
        })

    }

    function get(id){
         RoleResource.get(vm.seid,id).then(function(data){
            vm.info = data.data.result;
            for(var i in vm.Rolelist){
                for(var j in vm.info){
                    if(vm.Rolelist[i].id == vm.info[j].id){
                         vm.Rolelist[i].status=true;
                     }
                }
            }
            
        })
    }

    function delUser(userId,roleId){
        RoleResource.delUser(vm.seid,userId,roleId).then(function(data){
            console.log(data)
            if(data.data.status=="OK"){
                layer.msg('修改成功',{icon:1})
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function addUser(userId,roleId){
        console.log(userId);
        console.log(roleId)
       RoleResource.addUser(vm.seid,userId,roleId).then(function(data){
            console.log(data)
            if(data.data.status=="OK"){
                layer.msg('添加成功',{icon:1})
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }
}
})();
(function(){
"use strict"
angular.module('index_area').factory('UserResource', UserResource);
UserResource.$inject = ['$http','device','version'];
function UserResource($http,device,version) {
    return {
      list:list,
      get:get
    };

    function list(seid,skip,limit){
        return $http.get("/api-admin/user/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
          return data
        })
    }

    function get(seid,id){
        return $http.get("/authority/role/user/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit,'roleId':id}}).then(function(data){
          return data
        })
    }
}
})();