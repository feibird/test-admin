angular.module('index_area').controller('UpdateCouponCtrl', UpdateCouponCtrl);
UpdateCouponCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$state', 'PublicResource', 'CouponResource'];
function UpdateCouponCtrl($scope, $rootScope, $stateParams, $state, PublicResource, CouponResource) {
    document.title = "编辑优惠券";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "编辑优惠券";
    var vm = this;
    vm.info = new Object();
    vm.skip = 0;
    vm.limit = 10;
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

    get(vm.id)
    function get(id){
        CouponResource.get(vm.seid,id).then(function(data){
            vm.info = data.data.result;
            if(vm.info.amountLimit){
                vm.info.isGood=true;
            }
            console.log(vm.info)
        })
    }


    vm.AddcostSources = function () {
        var add = { costSourceId: "", ratio: "" };
        vm.Sources.push(add);
    }

    function objstring(obj) {
        if (typeof (obj) == 'stirng' || typeof (obj) == 'undefined' || typeof (obj) == null) {
            return obj;
        } else {
            var json = new Object();
            for (var i in obj) {
                json[obj[i].costSourceId] = obj[i].ratio * 0.01;
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