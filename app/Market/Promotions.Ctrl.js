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