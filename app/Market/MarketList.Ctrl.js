angular.module('index_area').config(config).controller('MarketListCtrl', MarketListCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider) {
    $stateProvider
        .state("task", {
            url: "/market/task",
            templateUrl: "Market/task.html",
            controller: 'taskCtrl as taskCtrl'
        })
        .state("updatetask", {
            url: "/market/updatetask/{id:string}",
            templateUrl: "Market/UpdateTask.html",
            controller: 'UpdateTaskCtrl as UpdateTaskCtrl'
        })
        .state("premlist", {
            url: "/market/premlist",
            templateUrl: "Market/Premiums.html",
            controller: 'PremlistCtrl as PremlistCtrl'
        })
        .state("gettask", {
            url: "/market/gettask/{id:string}",
            templateUrl: "Market/GetMark.html",
            controller: 'GetMarkCtrl as GetMarkCtrl'
        })
        .state("coupon", {
            url: "/market/coupon",
            templateUrl: "Market/Coupon.html",
            controller: 'CouponCtrl as CouponCtrl'
        })
        .state("addcoupon", {
            url: "/market/addcoupon",
            templateUrl: "Market/AddCoupon.html",
            controller: 'AddCouponCtrl as AddCouponCtrl'
        })
        .state("updatecoupon", {
            url: "/market/updatecoupon/{id:string}",
            templateUrl: "Market/UpdateCoupon.html",
            controller: 'UpdateCouponCtrl as UpdateCouponCtrl'
        })
}
MarketListCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource'];
function MarketListCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource) {
    document.title = "运营活动列表";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "运营活动列表"
    var vm = this;
    vm.idClass = false;
    vm.seid;
    login();
    list();
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
    function list() {
        MarketResource.list(vm.seid, 0, 0).then(function (data) {
            console.log(data.data.result)
            vm.list = data.data.result;
            for (var i in vm.list) {
                vm.list[i].startTime = chang_time(new Date(vm.list[i].startTime));
                if (vm.list[i].endTime != null) {
                    vm.list[i].endTime = chang_time(new Date(vm.list[i].endTime));
                }
            }
            vm.markList = new NgTableParams({}, { dataset: vm.list });
        })
    }

    vm.TypeBtn = function (data) {
        vm.task.productType = data;

    }

    vm.delBtn = function (id) {
        layer.confirm('您确定要删除此条？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            remove(id)
        });
    }

    function remove(id) {
        MarketResource.remove(vm.seid, id).then(function (data) {
            console.log(data)
            if (data.data.status == "OK") {
                layer.msg('删除成功！', { icon: 1 });
                list();
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }
    //时间戳转换2008-08-08:00:00:00格式
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
        return Y + M + D + h + m + s;
    }

}