angular.module('index_area').controller('RoleListCtrl',RoleListCtrl);
RoleListCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','MarketResource'];
function RoleListCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,MarketResource){
    document.title ="角色管理";
    $rootScope.name="角色管理"
    $rootScope.childrenName="角色管理列表"
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