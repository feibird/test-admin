angular.module('index_area').controller('UpdateTaskCtrl', UpdateTaskCtrl);
UpdateTaskCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource', 'StoresResource', 'GoodResource','CouponResource'];
function UpdateTaskCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource, StoresResource, GoodResource,CouponResource) {
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
    vm.data.prems = [];
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
    vm.data.type = "";
    vm.data.costSources = [];
    login();
    get(vm.id)


    vm.UpTask = function () {
        vm.data.storesIds = ArryString(vm.data.promotionStoreList, true);
        vm.data.goodsIds = ArryString(vm.data.promotionProductList, false);
        vm.data.prems = ArryString(vm.data.promotionGiftList, true);
        vm.data.costSources = objstring(vm.data.promotionCostSourceList);
        console.log(vm.data)
        if (typeof (vm.data.startTime) != "undefined" && vm.data.startTime != "" && typeof (vm.data.startTime) != 'number') {
            console.log(typeof (vm.data.startTime))
            vm.data.startTime = vm.data.startTime.getTime();
        }
        if (typeof (vm.data.endTime) != "undefined" && vm.data.endTime != "" && typeof (vm.data.endTime) != 'number') {
            console.log(vm.data.endTime)
            vm.data.endTime = vm.data.endTime.getTime();
        }
        if (vm.data.type == 'RANDOM_CUT') {
            if (vm.interval.length > 1) {
                vm.data.formulaParameterMap = {};
                for (var i in vm.interval) {
                    vm.data.formulaParameterMap['interval_' + vm.interval[i].start + "_" + vm.interval[i].end] = numeral(vm.interval[i].count*0.01).format('0.00');
                }
            }
        }
        console.log(vm.data);
        MarketResource.update(vm.seid, vm.data).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg("保存成功", { icon: 1 },function(){
                    history.go(-1);
                })
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

    function objstring(obj) {
        console.log(obj)
        if (typeof (obj) == 'stirng' || typeof (obj) == 'undefined' || typeof (obj) == null) {
            return obj;
        } else {
            var json = new Object();
            for (var i in obj) {
                json[obj[i].costSource.id] = numeral(obj[i].ratio*0.01).format("0.0");
            }
            return json;
        }

    }

    //将已选择的门店或者商品规格提取id为字符串链接
    function ArryString(obj, status) {
        if (typeof (obj) == 'stirng' || typeof (obj) == 'undefined' || typeof (obj) == null) {
            return obj;
        } else {
            var StoreArry = "";
            if (status) {
                for (var i in obj) {
                    StoreArry += obj[i].id + ",";
                }
            } else {
                for (var i in obj) {
                    console.log(obj[i].spec)
                    if (typeof (obj[i].spec) == 'undefined') {
                        StoreArry += obj[i].productSpecData.id + ",";
                    } else {
                        StoreArry += obj[i].spec.id + ",";
                    }
                }
            }
            StoreArry = StoreArry.substring(0, StoreArry.length - 1)
            return StoreArry
        }
    }

    vm.Addinterval = function () {
        var add = { start: 0, end: 0, count: 0 };
        vm.interval.push(add)
    }

    vm.Delinterval = function (index) {
        console.log(index)
        vm.interval.splice(index, 1)
    }

    vm.AddcostSources = function () {
        var add = { costSource: {}, ratio: "" };
        vm.data.promotionCostSourceList.push(add)
    }

    vm.DelcostSources = function (index) {
        vm.data.promotionCostSourceList.splice(index, 1)
    }

    //获取运营数据
    function get(id) {
        MarketResource.get(vm.seid, id).then(function (data) {
            vm.data = data.data.result;
            for (var i in vm.data.promotionCostSourceList) {
                vm.data.promotionCostSourceList[i].ratio = vm.data.promotionCostSourceList[i].ratio * 100;
            }
            vm.data.isDetail=vm.data.amountLimit==0?false:true;
            vm.data.prems = [];
            vm.data.costSources = [];
            vm.data.couponTemplateId = vm.data.couponTemplate.id
            console.log(vm.data);
            Get_interval(vm.data.formulaParameterMap);
            Get_goods(vm.data.promotionProductList);
        })
    }

    resource();
    function resource() {
        MarketResource.resource(vm.seid, 0, 0).then(function (data) {
            vm.resource = data.data.result;
            console.log(vm.resource)
        })
    }

     coupon();
    function coupon(){
        CouponResource.list(vm.seid,0,0).then(function(data){
            vm.CouponList = data.data.result;
            console.log(vm.CouponList)
        })
    }

    //解析Interbal(随机机制)
    function Get_interval(obj) {
        vm.interval = [];
        for (var i in obj) {
            if (i.indexOf('interval') > -1) {
                var json = new Object();
                json.start = i.substring(9, i.length).split("_")[0];
                json.end = i.substring(9, i.length).split("_")[1];
                json.count = numeral(obj[i]).format('0%').substring(0,numeral(obj[i]).format('0%').length-1);
                vm.interval.push(json);
            }
        }
    }



    //解析规格list
    function Get_goods(obj) {
        console.log(obj)
        var goods = [];
        var spec = {};
        spec.categories = {};
        for (var i in obj) {
            spec.id = obj[i].productSpecData.id;
            spec.spec = obj[i].productSpecData;
            spec.categories.data = obj[i].categoryList[0];
            spec.categories.children = obj[i].categoryList[1];
            spec.name = obj[i].baseProduct.name;
            spec.providerBrand = obj[i].brand;
            goods.push(spec);
            spec = {};
            spec.categories = {};
        }
        vm.data.promotionProductList = goods;
    }
}