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

    //初始化
    vm.init = function(){
        vm.get.source="";
        vm.get.status="";
        vm.get.storeId="";
        vm.get.id="";
        vm.get.createStartDate="";
        vm.get.createEndDate="";
        vm.get.completeStartDate="";
        vm.get.completeEndDate="";
    }

    vm.execl = function (time) {
        time = chang_time(new Date(time))
        window.open("api-admin/report/trade/dailyExcel?sessionId=" + vm.seid + "&device=" + device + "&version=" + version + "&date=" + time)
    }

    vm.St_order = function (time) {
        vm.get.source=typeof(vm.get.source)=='undefined'? "":vm.get.source;
        vm.get.status=typeof(vm.get.status)=='undefined'? "":vm.get.status;
        vm.get.storeId=typeof(vm.get.storeId)=='undefined'? "":vm.get.storeId;
        vm.get.id=typeof(vm.get.id)=='undefined'? "":vm.get.id;
        vm.get.createStartDate=GetTime(vm.get.createStartDate)
        vm.get.createEndDate=GetTime(vm.get.createEndDate)
        vm.get.completeStartDate=GetTime(vm.get.completeStartDate)
        vm.get.completeEndDate=GetTime(vm.get.completeEndDate)
        console.log(vm.get);
        list();
    }

    function GetTime(date){
        if(typeof(date)=='undefined'){
            return ""
        }else{
             if(typeof(date)=='object'){
                return date.getTime();
            }else{
                return date
            }
        }
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
                            "status": vm.get.status,
                            "source": vm.get.source,
                            "storeId": vm.get.storeId,
                            "phoneNumber":vm.get.phone,
                            'createEndDate':vm.get.createEndDate,
                            'createStartDate':vm.get.createStartDate,
                            'completeStartDate':vm.get.completeStartDate,
                            'completeEndDate':vm.get.completeEndDate,
                        }
                    }).then(function (data) {
                        if(data.data.status=='ERROR'){
                            layer.msg(data.data.message,{icon:2})
                            return false;
                        }
                        info.total(data.data.result.total);
                        for (var i in data.data.result.data) {
                            data.data.result.data[i].lastModifyDate = change_time(new Date(data.data.result.data[i].lastModifyDate));
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

    store();
    function store(){
        StoresResource.list(vm.seid,0,0).then(function(data){
            vm.stores = data.data.result.data;
            console.log(vm.stores)
        })
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
