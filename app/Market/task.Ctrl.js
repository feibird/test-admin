angular.module('index_area').controller('taskCtrl',taskCtrl);
taskCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','MarketResource','StoresResource','GoodResource'];
function taskCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,MarketResource,StoresResource,GoodResource){
    document.title ="新建运营活动";
    $rootScope.name="运营管理"
    $rootScope.childrenName="新建运营活动"
    var vm = this;
    vm.seid;
    vm.stores = new Object();
    vm.specs = new Array();

    vm.task = new Object();
    vm.task.formulaParameter = new Object();
    vm.task.productIds="";
    vm.task.timesLimit="";
    vm.task.amountLimit=""
    vm.task.storesId=""
    vm.FilterStores = new Array();      //已选择门店
    vm.GoodSpecs = new Array();
    login();


    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof(vm.user) == "undefined") {
        layer.alert("尚未登录！", {
            icon: 2
        }, function(index) {
            layer.close(index);
            PublicResource.Urllogin();
        });
        } else {
        vm.seid = PublicResource.seid(vm.user);
        }
    }
    stores();
    function stores(){
        StoresResource.list(vm.seid,0,0).then(function(data){
            vm.stores= data.data.result.data
            for (var i in vm.stores) {
                vm.stores[i].status=true;
            }
        })
    }

    good()
    function good(){
        GoodResource.list(vm.seid,null,0,0).then(function(data){
            vm.good = data.data.result.data;
            // console.log(vm.good)
            ArryAnalysis(vm.good)
            // vm.GoodList = new NgTableParams({},{dataset:vm.good});
        })
    }

    function ArryAnalysis(obj){
        var good = new Object();
        good.categories = new Object();
        for(var i in obj){
            for(var j in obj[i].specs){
                good.name = obj[i].name;
                good.categories.children = obj[i].categories.children[0].data;
                good.categories.data = obj[i].categories.data;
                good.providerBrand=obj[i].providerBrand;
                good.spec = obj[i].specs[j]
                good.status = true;
                vm.GoodSpecs.push(good);
                good = new Object();
                good.categories = new Object();
            }
        }
        vm.GoodList = new NgTableParams({},{dataset:vm.GoodSpecs});
    }

    function ArryString(obj,status){
        console.log(obj);
        var StoreArry="";
        if(status){
            for(var i in obj){
                StoreArry+=obj[i].id+","
            }
        }else{
            for(var i in obj){
                StoreArry+=obj[i].spec.id+","
            }
        }
        StoreArry =  StoreArry.substring(0,StoreArry.length-1)
        return StoreArry
    }

}