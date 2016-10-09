angular.module('index_area').controller('taskCtrl', taskCtrl);
taskCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource', 'StoresResource', 'GoodResource','CouponResource'];
function taskCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource, StoresResource, GoodResource,CouponResource) {
    document.title = "新建运营活动";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "新建运营活动"
    var vm = this;
    vm.seid;
    vm.task = new Object();                         //新增数据对象
    vm.task.formulaParameter = new Object();
    vm.date = {}
    vm.date.minDate = typeof (vm.date.minDate) ? 'undefined' : new Date();
    login();
    vm.interval = [];
    init();
    function init() {
        //添加对象
        vm.task.productIds = "";
        vm.task.timesLimit = "";
        vm.task.amountLimit = ""
        vm.task.storesId = [];
        vm.task.goodsId = [];
        vm.task.prems = [];
        vm.task.name = "";
        vm.task.description = "";
        vm.task.startTime = "";
        vm.task.userType = "";
        vm.task.endTime = "";
        vm.task.timesLimitCycle = "";
        vm.task.couponTemplateId="";
        vm.task.enabled = "";
        vm.task.excluslve = "";
        vm.task.priority = "";
        vm.task.productCountLimit = 0;
        vm.task.costSources = [];
    }

    vm.blus = function (name, data) {
        if (data == "" || data == null) {
            vm.verification[name] = true;
        } else {
            vm.verification[name] = false;
        }
    }

    vm.Addinterval = function () {
        var add = { start: 0, end: 0, count: 0 };
        vm.interval.push(add)
    }

    vm.Delinterval = function (index) {
        vm.interval.splice(index, 1)
    }

    vm.AddcostSources = function () {
        var add = { costSourceId: "", ratio: "" };
        vm.task.costSources.push(add)
    }

    vm.DelcostSources = function (index) {
        vm.task.costSources.splice(index, 1)
    }

    vm.AddTask = function () {
        console.log(vm.interval);
        if (iftask()) {
            if (vm.interval.length > 0) {
                vm.task.formulaParameter = {};
                for (var i in vm.interval) {
                    console.log(i)
                    vm.task.formulaParameter['interval_' + vm.interval[i].start + "_" + vm.interval[i].end] = numeral(vm.interval[i].count * 0.01).format('0.00')
                }
            }

            vm.task.costSource = objstring(vm.task.costSources);
            vm.task.storesIds = ArryString(vm.task.storesId, true);
            vm.task.goodsIds = ArryString(vm.task.goodsId, false);
            vm.task.premsId = ArryString(vm.task.prems, true);
            if (typeof (vm.task.startTime) != "undefined" && vm.task.startTime != "" && typeof (vm.task.startTime) != 'number') {
                vm.task.StartTime = vm.task.startTime.getTime();
            }
            if (typeof (vm.task.endTime) != "undefined" && vm.task.endTime != "" && typeof (vm.task.endTime) != 'number') {
                vm.task.EndTime = vm.task.endTime.getTime();
            }
            MarketResource.add(vm.seid, vm.task).then(function (data) {
                if (data.data.status == "OK") {
                    layer.msg("保存成功", { icon: 1 }, function () {
                        history.go(-1);
                    })
                } else {
                    layer.msg(data.data.message, { icon: 2 })
                }
            })
        }
    }

    function iftask() {
        var is = true;
        for (var i in vm.verification) {
            if (vm.verification[i] == null || vm.verification[i] == "" && vm.verification[i] != false) {
                vm.verification[i] = true;
                is = false;
            }
        }
        return is;
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

    resource();
    function resource() {
        MarketResource.resource(vm.seid, 0, 0).then(function (data) {
            vm.resource = data.data.result;
        })
    }

    coupon();
    function coupon(){
        CouponResource.list(vm.seid,0,0).then(function(data){
            vm.CouponList = data.data.result;
            console.log(vm.CouponList)
        })
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



}