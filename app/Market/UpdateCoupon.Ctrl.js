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
    function get(id) {
        CouponResource.get(vm.seid, id).then(function (data) {
            vm.info = data.data.result;
            for(var i in vm.info.couponCostSourceList){
                vm.info.couponCostSourceList[i].ratio=vm.info.couponCostSourceList[i].ratio;
            }
            if (vm.info.amountLimit) {
                vm.info.isGood = true;
            }
            console.log(vm.info)
        })
    }

     vm.AddcostSources = function () {
        var add = { costSourceId: "", ratio: "" };
        vm.info.couponCostSourceList.push(add);
    }


    vm.UpdateBtn = function () {
        vm.info.StratTime = typeof(vm.info.startTime)=='number'?vm.info.startTime:vm.info.startTime.getTime();
        vm.info.EndTime = typeof(vm.info.endTime)=='number'?vm.info.endTime:vm.info.endTime.getTime();
        vm.info.Sources = objstring(vm.info.couponCostSourceList);
        vm.info.storeIds = ArryString(vm.info.storeList, true);
        vm.info.goodIds = ArryString(vm.info.specList, false);
        CouponResource.update(vm.seid,vm.info).then(function(data){
            if(data.data.status=='OK'){
                layer.msg('修改成功',{icon:1},function(){

                })
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })

    }

    function chang_time(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
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

        if (h.length < 3) {
            h = "0" + h;
        }
        return Y + M + D + h + m + s;
    }


    function objstring(obj) {
        if (typeof (obj) == 'stirng' || typeof (obj) == 'undefined' || typeof (obj) == null) {
            return obj;
        } else {
            var json = new Object();
            for (var i in obj) {
                json[obj[i].costSource.id] = obj[i].ratio;
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