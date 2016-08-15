angular.module('index_area').controller('DrawDetailCtrl',DrawDetailCtrl);
DrawDetailCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','StoresResource','DrawResource','NgTableParams'];
/***调用接口***/
function DrawDetailCtrl($state,$scope,PublicResource,$stateParams,$rootScope,StoresResource,DrawResource,NgTableParams) {
    document.title ="提现管理";
    $rootScope.name="提现管理";
	   $rootScope.childrenName="提现管理列表";
    var vm = this;
}
