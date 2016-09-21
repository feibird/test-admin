/**
 * 基础商品列表控制器
 */
angular.module('index_area').config(config).controller('GoodlistCtrl', GoodlistCtrl);
/***二级路由***/
config.$inject = ['$stateProvider'];
function config($stateProvider) {
    $stateProvider
        .state("addgood", {
            url: "/good/add",
            templateUrl: "Good/AddGood.html",
            controller: 'AddGoodCtrl as AddGoodCtrl'
        })
        .state("update", {
            url: "/good/update/{id:string}",
            templateUrl: "Good/UpdateGood.html",
            controller: 'UpdateGoodCtrl as UpdateGoodCtrl'
        }).state("format", {
            url: "/good/format/{id:string}",
            templateUrl: "Good/Format.html",
            controller: 'FormatCtrl as FormatCtrl'
        }).state("gooddetail", {
            url: "/good/gooddetail/{id:string}",
            templateUrl: "Good/goodDetail.html",
            controller: 'GooddetialCtrl as GooddetialCtrl'
        }).state("storegooddetail", {
            url: "/good/storegooddetail/{id:string}",
            templateUrl: "Good/storegooddetail.html",
            controller: 'StoreGooddetailCtrl as StoreGooddetailCtrl'
        })
}
GoodlistCtrl.$inject = ['$scope', '$rootScope', '$state', 'GoodResource', 'PublicResource', "$stateParams", 'NgTableParams'];
function GoodlistCtrl($scope, $rootScope, $state, GoodResource, PublicResource, $stateParams, NgTableParams) {
    document.title = "基础商品列表";
    $rootScope.name = "基础商品"
    $rootScope.childrenName = "基础商品列表"
    var vm = this;
    vm.seid;
    vm.pagecount;                                                           //分页总数
    vm.pageint = 1;                                                           //当前分页导航
    vm.skip = 0                                                               //从第几个开始
    vm.limit = 12;                                                            //从第几个结束
    vm.list;





    //获取sessionId
    login();
    list(vm.seid);
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", { icon: 2 }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            })
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }

    vm.delBtn = function (id) {
        layer.confirm('是否删除商品？', {
            btn: ["确定", '取消']
        }, function () {
            remove(id);
        })
    }

    /**
     * 基础商品集合
     * @param {Object} seid
     */
    function list(seid) {
        GoodResource.list(seid, null, 0, 10).then(function (data) {
            vm.list = data.data.result;
            console.log(data)
            vm.tableParams = new NgTableParams({}, { dataset: vm.list.data });
            console.log(data.data.result)
        })
    }

    function remove(id) {
        GoodResource.del(vm.seid, id).then(function (data) {
            console.log(data)
            if (data.data.status == "OK") {
                layer.alert('删除成功~', { icon: 1 });
                list(vm.seid);
                layer.closeAll();
            } else {
                layer.msg('删除异常，请联系管理员~', { icon: 0 });
            }
        })
    }
}
