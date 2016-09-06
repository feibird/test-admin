angular.module('index_area').controller('WalletCtrl', WalletCtrl);
WalletCtrl.$inject = ['$state', '$scope', 'PublicResource', '$stateParams', '$rootScope', 'StoresResource', 'WalletResource'];
/***调用接口***/
function WalletCtrl($state, $scope, PublicResource, $stateParams, $rootScope, StoresResource, WalletResource) {
    document.title = "入账管理";
    $rootScope.name = "入账管理";
    $rootScope.childrenName = "入账管理列表";
    var vm = this;
    vm.pagecount;
    vm.skip = 0;
    vm.limit = 20;                                                          //分页总数
    vm.pageint = 1;
    vm.name=null;
    //分页点击事件
    vm.pageChanged = function () {
        vm.skip = (vm.pageint - 1) * vm.limit;
        list(vm.seid);
    }
    login();


    vm.exel = function () {
        vm.filer.createStartDate = GTM(false, vm.filer.createStartDate)
        vm.filer.createEndDate = GTM(true, vm.filer.createEndDate)
        console.log(vm.filer)
        window.open("/api-admin/report/trade/detail/excel?sessionId=" + vm.seid
            + "&device=" + 'pc'
            + "&version=" + '2.0.0'
            + "&sources=" + vm.filer.sources
            + "&detail=" + vm.filer.detail
            + "&storeId=" + vm.filer.storeId
            + "&completeEndDate=" + vm.filer.createEndDate
            + "&completeStartDate=" + vm.filer.createStartDate
        )

    }


    vm.get = function(){
        if(vm.name==""||vm.name.length<1||vm.name==null){
             vm.is=false;
        }else{
            vm.is=true;
            list();
        }
       
    }

    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", {
                icon: 2
            }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            });
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }

    list();
    stores();
    //入账列表
    function list() {
        WalletResource.list(vm.seid,vm.name, vm.skip, vm.limit).then(function (data) {
            console.log(data.data)
            vm.list = data.data.result.data;
            vm.pagecount = data.data.result.total;
            console.log(vm.list)
        })
    }


    //获取所有门店
    function stores() {
        StoresResource.list(vm.seid,0,0).then(function (data) {
            vm.store = data.data.result.data;
            console.log(vm.store)
        })
    }


}
