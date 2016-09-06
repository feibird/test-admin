angular.module('index_area').controller('GetMarkCtrl', GetMarkCtrl);
GetMarkCtrl.$inject = ['$scope', '$rootScope','$stateParams', '$state', 'PublicResource', 'MarketResource'];
function GetMarkCtrl($scope,$rootScope,$stateParams, $state, PublicResource, MarketResource) {
    document.title = "查看运营活动";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "查看运营活动";    
    var vm = this;
    vm.id = $stateParams.id;
    login();
    get();
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", {
                icon: 2
            }, function (index) {
                layer.close(index);
                PublicResource.Urllogin() ;
            });
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }

    function get(){
        MarketResource.get(vm.seid,vm.id).then(function(data){
            console.log(data);
            vm.task = data.data.result;
        })
    }
}