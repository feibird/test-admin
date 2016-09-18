angular.module('index_area').controller('OrderlistCtrl', OrderlistCtrl);
OrderlistCtrl.$inject = ['$state', '$scope', 'PublicResource', '$stateParams', '$rootScope', 'StoresResource', 'OrderResource', 'NgTableParams', 'device', 'version', '$http'];
/***调用接口***/
function OrderlistCtrl($state, $scope, PublicResource, $stateParams, $rootScope, StoresResource, OrderResource, NgTableParams, device, version, $http) {
    document.title = "订单管理";
    $rootScope.name = "订单管理";
    $rootScope.childrenName = "订单管理列表";
    var vm = this;
    vm.stores;              //门店集合
    vm.skip = 0;
    vm.limit = 50;
    vm.list;
    vm.get = new Object();
    vm.filerPay = [
        { title: '微信公众号', id: 'WECHAT_WEB' },
        { title: '微信支付', id: 'WECHAT_APP' },
        { title: '支付宝网页', id: 'ZHIFUBAO_WEB' },
        { title: '支付宝应用', id: 'ZHIFUBAO_APP' },
        { title: '线下支付', id: null }
    ]
    //获取sessionId
    login();
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

    vm.execl = function (time) {
        time = chang_time(new Date(time))
        window.open("api-admin/report/trade/dailyExcel?sessionId=" + vm.seid + "&device=" + device + "&version=" + version + "&date=" + time)
    }

    vm.St_order = function (time) {
        list();
    }

    list();

    function list() {

        vm.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 50, // count per page
            per_page: 10
        }, {
                filterDelay: 300,
                getData: function (info) {
                    vm.skip = vm.limit * (info.page() - 1);
                    return $http.get("/api-admin/trade/list", {
                        params: {
                            "device": device,
                            "version": version,
                            "sessionId": vm.seid,
                            "skip": vm.skip,
                            "limit": vm.limit,
                            "takeNo": vm.get.id,
                            "status": vm.get.status
                        }
                    }).then(function (data) {
                        info.total(data.data.result.total);
                        for (var i in data.data.result.data) {
                            data.data.result.data[i].createDate = change_time(new Date(data.data.result.data[i].createDate));
                            if (data.data.result.data[i].endDate != null) {
                                data.data.result.data[i].endDate = change_time(new Date(data.data.result.data[i].endDate))
                            }
                        }
                        return data.data.result.data;
                    })
                }
            });
    }

    vm.compel = function (id) {
        layer.confirm('您确定要退款？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            OrderResource.refund(vm.seid, id).then(function (data) {
                if (data.data.status == "OK") {
                    layer.msg('退款成功', { icon: 1 });
                    list();
                } else {
                    layer.msg(data.data.message, { icon: 2 })
                }
            })
        });
    }

    function change_time(date) {
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
        if (s < 9 || s == 9) {
            s = "0" + s;
        }

        if (h.length < 3) {
            h = "0" + h;
        }
        return Y + M + D + h + m + s;
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
        return Y + M + D;
    }

    function update(status, id) {
        OrderResource.update(vm.seid, status, id).then(function (data) {
            console.log(data);
            if (data.data.status == "OK") {
                layer.alert('修改成功', { icon: 1 })
            } else {
                layer.alert(data.data.message, { icon: 2 })
            }
            list();
        })
    }

}
