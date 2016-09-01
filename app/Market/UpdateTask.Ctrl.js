angular.module('index_area').controller('UpdateTaskCtrl', UpdateTaskCtrl);
UpdateTaskCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'MarketResource', 'StoresResource', 'GoodResource'];
function UpdateTaskCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, MarketResource, StoresResource, GoodResource) {
    document.title = "编辑运营活动";
    $rootScope.name = "运营管理"
    $rootScope.childrenName = "编辑运营活动"
    var vm = this;
    vm.id = $stateParams.id;
    vm.seid;
    vm.stores = new Object();
    vm.specs = new Array();
    vm.data = new Object();
    vm.data.formulaParameter = new Object();
    vm.data.productIds = "";
    vm.data.timesLimit = "";
    vm.data.amountLimit = ""
    vm.FilterStores = new Array();      //已选择门店
    vm.GoodSpecs = new Array();
    login();
    get(vm.id)
    vm.UpTask = function () {
        for (var i = 0; i < $('.date').length; i++) {

            vm.task[$('.date').eq(i).attr('name')] = $('.date').val();
        }
        vm.data.storeIds = ""
        if (vm.data.storeType == "SELECTED_STORE") {
            vm.data.storeIds = ArryString(vm.FilterStores, true)
        }
        if (vm.data.productType == 'SELECTED_PRODUCT') {
            vm.data.productIds = ArryString(vm.specs, false)
        }
        if (typeof (vm.data.startTime) != "undefined" && vm.data.startTime != "" && typeof (vm.data.startTime) != 'number') {
            console.log(typeof (vm.data.startTime))
            vm.data.startTime = vm.data.startTime.getTime();
        }
        if (typeof (vm.data.endTime) != "undefined" && vm.data.endTime != "" && typeof (vm.data.endTime) != 'number') {
            console.log(vm.data.endTime)
            vm.data.endTime = vm.data.endTime.getTime();
        }
        console.log(vm.data);
        MarketResource.update(vm.seid, vm.data).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg("保存成功", { icon: 1 })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    //添加门店
    vm.AddStores = function (list) {
        if (list.status) {
            vm.FilterStores.push(list)
            list.status = false;
            console.log(vm.FilterStores);
        }
    }

    //添加规格
    vm.AddSpecs = function (item) {
        if (item.status) {
            vm.specs.push(item)
            item.status = false;
        }
        vm.specList = new NgTableParams({}, { dataset: vm.specs });
    }

    //删除已选择门店
    vm.delStores = function (name) {
        if (name) {
            for(var i in vm.FilterStores){
                if(vm.FilterStores[i].name == name){
                    console.log(vm.FilterStores[i])
                    vm.FilterStores.splice(i,1);
                }
            }
        } else {
            for (var i in vm.FilterStores) {
                if (vm.FilterStores[i].check) {
                    console.log(vm.storesList[i])
                    vm.storesList[i].status = true;
                    vm.storesList[i].active = false;
                    vm.FilterStores.splice(i, 1);
                    
                }
            }
        }

    }

    //删除已选择规格
    vm.delSpecs = function (i, id) {
        if (i) {
            for (var x in vm.GoodSpecs) {
                if (vm.GoodSpecs[x].spec.id == id) {
                    console.log(vm.specs[i])
                    console.log(vm.GoodSpecs[x])
                    vm.GoodSpecs[x].status = true;
                    vm.specs.splice(i, 1);
                    vm.specList = new NgTableParams({}, { dataset: vm.specs });
                }
            }
        } else {
            for (var i in vm.specs) {
                if (vm.specs[i].check) {
                    console.log(vm.specs[i])
                    for (var x in vm.GoodSpecs) {
                        if (vm.GoodSpecs[x].spec.id == vm.specs[i].spec.id) {
                            vm.GoodSpecs[x].status = true;
                        }
                    }
                    vm.specs.splice(i, 1);
                }
            }
            vm.specList = new NgTableParams({}, { dataset: vm.specs });
        }
    }

    //全选事件
    vm.All = function (is) {
        switch (is) {
            case 'AddStore':
                for (var i in vm.storesList) {
                    if (vm.storesList[i].active) {
                        vm.storesList[i].active = false;
                    } else {
                        vm.storesList[i].active = true;
                    }
                }
                break;
            case 'DelStore':
                for (var i in vm.FilterStores) {
                    if (vm.FilterStores[i].check) {
                        vm.FilterStores[i].check = false;
                    } else {
                        vm.FilterStores[i].check = true;
                    }
                }
                break;
            case 'AddSpecs':
                for (var i in vm.GoodSpecs) {
                    if (vm.GoodSpecs[i].active) {
                        vm.GoodSpecs[i].active = false;
                    } else {
                        vm.GoodSpecs[i].active = true;
                    }
                }
                break;
            case 'DelSpecs':
                for (var i in vm.specs) {
                    if (vm.specs[i].check) {
                        vm.specs[i].check = false;
                    } else {
                        vm.specs[i].check = true;
                    }
                }
                break;
        }
    }

    //删除所有
    vm.delAll = function () {
        for (var i in vm.FilterStores) {
            vm.FilterStores[i].check = true;
        }
    }

    //添加门店
    vm.TopStore = function () {
        for (var i in vm.storesList) {
            if (vm.storesList[i].active) {
                vm.FilterStores.push(vm.storesList[i])
                vm.storesList[i].status = false;
                vm.storesList[i].active = false;
            }
        }
    }

    //添加所有规格
    vm.SpecsAll = function () {
        for (var i in vm.GoodSpecs) {
            if (vm.GoodSpecs[i].active) {
                vm.specs.push(vm.GoodSpecs[i])
                vm.GoodSpecs[i].status = false;
                vm.GoodSpecs[i].active = false;
            }
        }
        vm.specList = new NgTableParams({}, { dataset: vm.specs });
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
    stores();
    //门店列表
    function stores() {
        StoresResource.list(vm.seid, 0, 0).then(function (data) {
            vm.storesList = data.data.result.data
            for (var i in vm.storesList) {
                vm.storesList[i].status = true;
            }
            vm.StroesList = new NgTableParams({}, { dataset: vm.storesList });
        })
    }
    good()
    //商品列表
    function good() {
        GoodResource.list(vm.seid, null, 0, 0).then(function (data) {
            vm.good = data.data.result.data;
            // console.log(vm.good)
            ArryAnalysis(vm.good)
            // vm.GoodList = new NgTableParams({},{dataset:vm.good});
        })
    }

    //商品列表加工
    function ArryAnalysis(obj) {
        var good = new Object();
        good.categories = new Object();
        for (var i in obj) {
            for (var j in obj[i].specs) {
                good.name = obj[i].name;
                good.categories.children = obj[i].categories.children[0].data;
                good.categories.data = obj[i].categories.data;
                good.providerBrand = obj[i].providerBrand;
                good.spec = obj[i].specs[j]
                good.status = true;
                vm.GoodSpecs.push(good);
                good = new Object();
                good.categories = new Object();
            }
        }
        vm.GoodList = new NgTableParams({}, { dataset: vm.GoodSpecs });
    }

    //将已选择的门店或者商品规格提取id为字符串链接
    function ArryString(obj, status) {
        console.log(obj);
        var StoreArry = "";
        if (status) {
            for (var i in obj) {
                StoreArry += obj[i].id + ","
            }
        } else {
            for (var i in obj) {
                console.log(obj[i])
                StoreArry += obj[i].spec.id + ","
            }
        }
        StoreArry = StoreArry.substring(0, StoreArry.length - 1)
        return StoreArry
    }

    //获取运营数据
    function get(id) {
        MarketResource.get(vm.seid, id).then(function (data) {
            vm.data = data.data.result;
            for (var i in vm.data.promotionStoreList) {
                vm.FilterStores.push(vm.data.promotionStoreList[i])
                vm.data.promotionStoreList[i].status = false;
            }
            for (var i in vm.data.promotionProductList) {
                vm.specs.push(vm.data.promotionProductList[i])
                vm.data.promotionProductList[i].status = false;
            }
            vm.specList = new NgTableParams({}, { dataset: vm.specs });
            console.log(vm.data)
        })
    }

}