angular.module('index_area').config(config).controller('MarketListCtrl',MarketListCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider){
    $stateProvider.state("list", {
                        url: "/good/add",
                        templateUrl: "Good/AddGood.html",
                        controller: 'AddGoodCtrl as AddGoodCtrl'
                    })
}
MarketListCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','MarketResource'];
function MarketListCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,MarketResource){
    document.title ="运营活动列表";
    $rootScope.name="运营管理"
    $rootScope.childrenName="运营活动列表"
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
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
        MarketResource.list(vm.seid,0,0).then(function(data){
            console.log(data)
        })
    }
}