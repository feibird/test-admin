angular.module('index_area').controller('RecordedlistCtrl',RecordedlistCtrl);
RecordedlistCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','StoresResource','RecordedResource','NgTableParams'];
/***调用接口***/
function RecordedlistCtrl($state,$scope,PublicResource,$stateParams,$rootScope,StoresResource,RecordedResource,NgTableParams) {
    document.title ="入账管理";
    $rootScope.name="入账管理";
	$rootScope.childrenName="入账管理列表";
    var vm = this;
    
    login();

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
