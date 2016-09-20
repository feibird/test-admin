angular.module('index_area').controller('CouponCtrl', CouponCtrl);
CouponCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$state', 'PublicResource', 'CouponResource'];
function CouponCtrl($scope, $rootScope, $stateParams, $state, PublicResource, CouponResource) {
    document.title = "优惠券管理";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "优惠券管理";
    var vm = this;
    vm.skip=0;
    vm.limit=10;
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

    list();
    function list(){
        CouponResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
            vm.list = data.data.result;
            for(var i in vm.list){
                vm.list[i].startTime = chang_time(new Date(vm.list[i].startTime));
                vm.list[i].endTime = chang_time(new Date(vm.list[i].endTime));
            }
            console.log(vm.list)
        })
    }

    vm.del = function(id){
        layer.confirm('您确定要删除此条？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			CouponResource.remove(vm.seid,id).then(function(data){
                if(data.data.status=="OK"){
                    layer.msg('删除成功',{icon:1});
                    list();
                }else{
                    layer.msg(data.data.message,{icon:2})
                }
            })
		});
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
        return Y + M + D+h+m+s;
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