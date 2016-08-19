angular
    .module("index_area",["ui.router",'LocalStorageModule','ui.bootstrap','ngTable','angularFileUpload'])
    .constant("device","pc")			//定义全局变量:设备编号
    .constant("version","2.0.0")		//定义全局变量:版本号
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/stores/list");
        $stateProvider
        .state("/sort/list", {											                       //分类管理
                url: "/sort/list",
                templateUrl: "Sort/list.html",
                 controller: 'SortlistCtrl as SortlistCtrl',
                 params: {'index':3}
        })
        .state("/supplierlogo/list", {									                      //供应商品牌
                url: "/supplierlogo/list",
                templateUrl: "SupplierLogo/list.html",
                 controller: 'SupplierLogolistCtrl as SupplierLogolistCtrl',
                 params: {'index':5}
        })
         .state("/brandstores/list", {								                       	//连锁品牌
                url: "/brandstores/list",
                templateUrl: "BrandStores/list.html",
                controller: 'BrandStoreslistCtrl as BrandStoreslistCtrl',
                params: {'index':5}
        })
        .state("/stores/list", {                                                             //门店管理
                url: "/stores/list",
                templateUrl: "Stores/list.html",
                controller: 'StoreslistCtrl as StoreslistCtrl',
                params: {'index':5}
        })
        .state("/label/list", {                                                              //标签管理
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
        .state("/order/Drawlist", {                                                              //结账管理
                url: "/order/Drawlist",
                templateUrl: "Order/Drawlist.html",
                controller: 'DrawlistCtrl as DrawlistCtrl',
            params: {'index':5}
        })
        .state("/good/list", {                                                               //商品管理
                url: "/good/list",
                templateUrl: "Good/list.html",
                controller: 'GoodlistCtrl as GoodlistCtrl',
                params: {'index':5}
        })
        .state("/finance/list", {                                                               //财务管理
                url: "/Finance/drawlist",
                templateUrl: "Finance/drawlist.html",
                controller: 'DrawlistCtrl as DrawlistCtrl',
                params: {'index':5}
        })
        .state("/market/list", {                                                               //财务管理
                url: "/market/list",
                templateUrl: "Market/list.html",
                controller: 'MarketListCtrl as MarketListCtrl',
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
