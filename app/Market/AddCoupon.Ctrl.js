angular.module('index_area').controller('AddCouponCtrl', AddCouponCtrl);
AddCouponCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$state', 'PublicResource', 'CouponResource'];
function AddCouponCtrl($scope, $rootScope, $stateParams, $state, PublicResource, CouponResource) {
    document.title = "优惠券管理";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "优惠券管理";
    var vm = this;
    vm.skip = 0;
    vm.limit = 10;
    vm.Coupon = new Object();
    vm.Coupon.goodIds = '';
    vm.Coupon.storeIds = '';
    vm.Coupon.whiteListIds = '';
    vm.goodId = [];
    vm.Sources = [];
    vm.whites = [];
    vm.id = $stateParams.id;
    login();
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

    vm.AddcostSources = function () {
        var add = { costSourceId: "", ratio: "" };
        vm.Sources.push(add);
    }

    vm.AddBtn = function () {
        vm.Coupon.StratTime = vm.Coupon.startTime.getTime();
        vm.Coupon.EndTime = vm.Coupon.endTime.getTime();
        vm.Coupon.Sources = objstring(vm.Sources);
        vm.Coupon.storeIds = ArryString(vm.storesId, true);
        vm.Coupon.goodIds = ArryString(vm.goodId, false);
        vm.Coupon.specCountLimit = vm.Coupon.specType == "ALL_SPEC" ? "" : vm.Coupon.specCountLimit;
        console.log(vm.Coupon)
        CouponResource.add(vm.seid, vm.Coupon).then(function (data) {
            if (data.data.status == 'OK') {
                layer.msg('添加成功', { icon: 1 }, function () {
                    history.go(-1);
                })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function objstring(obj) {
        if (typeof (obj) == 'stirng' || typeof (obj) == 'undefined' || typeof (obj) == null) {
            return obj;
        } else {
            var json = new Object();
            for (var i in obj) {
                json[obj[i].costSourceId] = obj[i].ratio;
            }
            return json;
        }

    }

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


    resource();
    function resource() {
        CouponResource.resource(vm.seid, 0, 0).then(function (data) {
            vm.resource = data.data.result;
            console.log(vm.resource)
        })
    }
}