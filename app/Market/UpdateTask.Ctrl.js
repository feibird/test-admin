angular.module('index_area').controller('UpdateTaskCtrl', UpdateTaskCtrl);
UpdateTaskCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource', 'StoresResource', 'GoodResource'];
function UpdateTaskCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource, StoresResource, GoodResource) {
    document.title = "编辑运营活动";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "编辑运营活动"
    var vm = this;
    vm.id = $stateParams.id;
    vm.seid;
    vm.data = new Object();
    vm.data.formulaParameter = new Object();
    vm.data.productIds = "";
    vm.data.timesLimit = "";
    vm.data.amountLimit = ""
    vm.data.storesId = [];
    vm.data.goodsId = [];
    vm.data.name = "";
    vm.data.description = "";
    vm.data.startTime = "";
    vm.data.userType = "";
    vm.data.endTime = "";
    vm.data.timesLimitCycle = "";
    vm.data.timesLimitType = "";
    vm.data.enabled = "";
    vm.data.excluslve = "";
    vm.data.priority = "";
    vm.data.type = ""
    login();
    get(vm.id)

   
    vm.UpTask = function () {
        vm.data.storesIds = ArryString(vm.data.storesId, true);
        vm.data.goodsIds = ArryString(vm.data.goodsId, false);
        if (typeof (vm.data.startTime) != "undefined" && vm.data.startTime != "" && typeof (vm.data.startTime) != 'number') {
            console.log(typeof (vm.data.startTime))
            vm.data.startTime = vm.data.startTime.getTime();
        }
        if (typeof (vm.data.endTime) != "undefined" && vm.data.endTime != "" && typeof (vm.data.endTime) != 'number') {
            console.log(vm.data.endTime)
            vm.data.endTime = vm.data.endTime.getTime();
        }
        console.log(vm.data);
        MarketResource.update(vm.seid, vm.data).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg("保存成功", { icon: 1 })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
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

    //将已选择的门店或者商品规格提取id为字符串链接
    function ArryString(obj, status) {
         console.log(obj, typeof (obj))
        if (typeof (obj) == 'stirng' || typeof (obj) == 'undefined' || typeof (obj) == null) {
            return obj;
        } else {
            var StoreArry = "";
            if (status) {
                for (var i in obj) {
                    StoreArry += obj[i].id + ","
                }
            } else {
                for (var i in obj) {
                    StoreArry += obj[i].spec.id + ","
                }
            }
            StoreArry = StoreArry.substring(0, StoreArry.length - 1)
            return StoreArry
        }
    }

    //获取运营数据
    function get(id) {
        MarketResource.get(vm.seid, id).then(function (data) {
            vm.data = data.data.result;
            console.log(vm.data)
        })
    }

}