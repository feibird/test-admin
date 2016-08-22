angular.module('index_area').controller('task_2Ctrl',task_2Ctrl);
task_2Ctrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','MarketResource'];
function task_2Ctrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,MarketResource){
    document.title ="新建运营活动";
    $rootScope.name="运营管理"
    $rootScope.childrenName="新建运营活动"
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
        
    }
}