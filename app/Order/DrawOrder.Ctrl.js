angular.module('index_area').controller('MarketListCtrl',MarketListCtrl);
MarketListCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','DrawListrResource'];
function MarketListCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,DrawListrResource){
    document.title ="提现列表";
    $rootScope.name="订单管理"
    $rootScope.childrenName="提现列表"
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
        DrawListrResource.list(vm.seid,0,0).then(function(data){
            console.log(data)
        })
    }
}