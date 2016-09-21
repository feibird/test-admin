angular
    .module("index_area", ["ui.router", 'LocalStorageModule', 'ui.bootstrap.datetimepicker', 'ui.bootstrap', 'ngTable', 'angularFileUpload'])
    .constant("device", "pc")			//定义全局变量:设备编号
    .constant("version", "2.0.0")		//定义全局变量:版本号
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider.otherwise("/stores/list");

        $httpProvider.defaults.transformRequest = function (obj) {
            var str = [];
            for (var p in obj) {
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
                params: { 'index': 3 }
            })
            .state("/supplierlogo/list", {									                          //供应商品牌
                url: "/supplierlogo/list",
                templateUrl: "SupplierLogo/list.html",
                controller: 'SupplierLogolistCtrl as SupplierLogolistCtrl',
                params: { 'index': 5 }
            })
            .state("/brandstores/list", {								                        	//连锁品牌
                url: "/brandstores/list",
                templateUrl: "BrandStores/list.html",
                controller: 'BrandStoreslistCtrl as BrandStoreslistCtrl',
                params: { 'index': 5 }
            })
            .state("/stores/list", {                                                                 //门店管理
                url: "/stores/list",
                templateUrl: "Stores/list.html",
                controller: 'StoreslistCtrl as StoreslistCtrl',
                params: { 'index': 5 }
            })
            .state("/label/list", {                                                                      //标签管理
                url: "/label/list",
                templateUrl: "Label/list.html",
                controller: 'LabellistCtrl as LabellistCtrl',
                params: { 'index': 5 }
            })
            .state("/order/orderlist", {                                                              //订单管理
                url: "/order/orderlist",
                templateUrl: "Order/Orderlist.html",
                controller: 'OrderlistCtrl as OrderlistCtrl',
                params: { 'index': 5 }
            })
            .state("/good/list", {                                                                   //商品管理
                url: "/good/list",
                templateUrl: "Good/list.html",
                controller: 'GoodlistCtrl as GoodlistCtrl',
                params: { 'index': 5 }
            })
            .state("/finance/list", {                                                               //财务管理
                url: "/finance/drawlist",
                templateUrl: "Finance/drawlist.html",
                controller: 'DrawlistCtrl as DrawlistCtrl',
                params: { 'index': 5 }
            })
            .state("/market/list", {                                                               //运营管理
                url: "/market/list",
                templateUrl: "Market/list.html",
                controller: 'MarketListCtrl as MarketListCtrl',
                params: { 'index': 5 }
            })
            .state("/user/userlist", {                                                               //用户管理
                url: "/user/userlist",
                templateUrl: "User/Userlist.html",
                controller: 'UserListCtrl as UserListCtrl',
                params: { 'index': 5 }
            })
            .state("/user/rolelist", {                                                               //角色管理
                url: "/user/rolelist",
                templateUrl: "User/Rolelist.html",
                controller: 'RoleListCtrl as RoleListCtrl',
                params: { 'index': 5 }
            })
            .state("/music/list", {                                                               //语音管理
                url: "/music/musiclist",
                templateUrl: "Music/list.html",
                controller: 'MusicListCtrl as MusicListCtrl',
                params: { 'index': 5 }
            })
        //去掉#号  
        /*$locationProvider.html5Mode(true);*/

    })
    .run(run);
run.$inject = ['$rootScope', '$state', '$location', 'localStorageService', 'PublicResource']
function run($rootScope, $state, $location, localStorageService, PublicResource) {
    var seid;
    login();
    var userName;
    var user;
    PublicResource.user(seid).then(function (data) {
        userName = data.result.name;
    });
    $rootScope.userName = userName;
    function login() {
        user = PublicResource.seid("admin");
        if (typeof (user) == "undefined") {
            layer.alert("尚未登录！", { icon: 2 }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            })
        } else {
            seid = PublicResource.seid(user);
            $rootScope.seid = seid;
        }
    }
    console.log($rootScope.seid)


    $rootScope.logout = function () {
        PublicResource.logout(seid).then(function (data) {
            console.log(data);
            if (data.status == 'OK') {
                layer.alert('退出成功~', { icon: 1 }, function () {
                    $.session.remove('admin');
                    $.session.remove(user);
                    layer.closeAll();
                    PublicResource.Urllogin();
                })
            }
        })
    }

}
