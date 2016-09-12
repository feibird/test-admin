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
    vm.sum = new Object();
    //分页点击事件
    vm.pageChanged = function () {
        vm.skip = (vm.pageint - 1) * vm.limit;
        list(vm.seid);
    }
    login();


    vm.exel = function () {
        window.open("/api-admin/store/wallet/excel?sessionId=" + vm.seid
            + "&device=" + 'pc'
            + "&version=" + '2.0.0'
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
    count();
    //入账列表
    function list() {
        WalletResource.list(vm.seid,vm.name, vm.skip, vm.limit).then(function (data) {
            console.log(data.data)
            vm.list = data.data.result.data;
            vm.pagecount = data.data.result.total;
            console.log(vm.list)
        })
    }


    function count(){
         WalletResource.sum(vm.seid).then(function (data) {
            vm.sum.money = data.data.result;
            vm.sum.time = chang_time(new Date(data.data.time));
        })
    }

    //获取所有门店
    function stores() {
        StoresResource.list(vm.seid,0,0).then(function (data) {
            vm.store = data.data.result.data;
            console.log(vm.store)
        })
    }

    function chang_time(date) {
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        if (D.length < 3) {
            D = "0" + D;
        }
        if (m.length < 3) {
            m = "0" + m;
        }

        if (s < 9) {
            s = "0" + s;
        }
        return Y + M + D +h +m +s;
    }

}
