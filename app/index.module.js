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
