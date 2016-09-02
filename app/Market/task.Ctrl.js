angular.module('index_area').controller('taskCtrl', taskCtrl);
taskCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource', 'StoresResource', 'GoodResource'];
function taskCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource, StoresResource, GoodResource) {
    document.title = "新建运营活动";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "新建运营活动"
    var vm = this;
    vm.seid;
    vm.task = new Object();
    vm.task.formulaParameter = new Object();
    vm.task.productIds = "";
    vm.task.timesLimit = "";
    vm.task.amountLimit = ""
    vm.task.storesId = [];
    vm.task.goodsId = [];
    vm.task.name = "";
    vm.task.description = "";
    vm.task.startTime = "";
    vm.task.userType = "";
    vm.task.endTime = "";
    vm.task.timesLimitCycle = "";
    vm.task.timesLimitType = "";
    vm.task.enabled = "";
    vm.task.excluslve = "";
    vm.task.priority = "";
    vm.task.type = ""
    login();

     vm.interval=[{
            start:0,
            end:0,
            count:0
        }];
    
    vm.Addinterval=function(){
        var add = {start:0,end:0,count:0};
        vm.interval.push(add)
    }

    vm.Delinterval=function(index){
        console.log(index)
        vm.interval.splice(index,1)
    }

    vm.AddTask = function () {
        if(vm.interval.length>1){
            for(var i in vm.interval){
                vm.task.formulaParameter['interval_'+vm.interval[i].start+"_"+vm.interval[i].end] = vm.interval[i].count;
            }
        }
        vm.task.storesIds = ArryString(vm.task.storesId, true);
        vm.task.goodsIds = ArryString(vm.task.goodsId, false);
        if (typeof (vm.task.startTime) != "undefined" && vm.task.startTime != "" && typeof (vm.task.startTime) != 'number') {
            console.log(typeof (vm.task.startTime))
            vm.task.startTime = vm.task.startTime.getTime();
        }
        if (typeof (vm.task.endTime) != "undefined" && vm.task.endTime != "" && typeof (vm.task.endTime) != 'number') {
            console.log(vm.task.endTime)
            vm.task.endTime = vm.task.endTime.getTime();
        }
        console.log(vm.task);
        MarketResource.add(vm.seid, vm.task).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg("保存成功", { icon: 1 })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
        console.log(vm.task)
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



}