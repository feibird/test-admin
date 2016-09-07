angular.module('index_area').controller('GetMarkCtrl', GetMarkCtrl);
GetMarkCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$state', 'PublicResource', 'MarketResource'];
function GetMarkCtrl($scope, $rootScope, $stateParams, $state, PublicResource, MarketResource) {
    document.title = "查看运营活动";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "查看运营活动";
    var vm = this;
    vm.id = $stateParams.id;
    login();
    get();
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

    function get() {
        MarketResource.get(vm.seid, vm.id).then(function (data) {
            vm.task = data.data.result;
            vm.task.startTime = chang_time(new Date(vm.task.startTime));
            vm.task.endTime = chang_time(new Date(vm.task.endTime));
            vm.task.interval = Get_interval(vm.task.formulaParameterMap)
            console.log(vm.task)
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

        if (h.length < 3) {
            h = "0" + h;
        }
        return Y + M + D;
    }

    //解析Interbal(随机机制)
    function Get_interval(obj) {
        var interval = [];
        for (var i in obj) {
            if (i.indexOf('interval') > -1) {
                var json = new Object();
                json.start = i.substring(9, i.length).split("_")[0];
                json.end = i.substring(9, i.length).split("_")[1];
                json.count = obj[i] * 100;
                interval.push(json);
            }
        }
        return interval;
    }
}