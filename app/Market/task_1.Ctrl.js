angular.module('index_area').controller('task_1Ctrl',task_1Ctrl);
task_1Ctrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','MarketResource','StoresResource'];
function task_1Ctrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,MarketResource,StoresResource){
    document.title ="新建运营活动";
    $rootScope.name="运营管理"
    $rootScope.childrenName="新建运营活动"
    var vm = this;
    vm.seid;
    vm.stores = new Object();
    vm.task = new Object();
    vm.FilterStores = new Array();
    login();

    vm.AddStores = function(list){
        if(list.status){
            vm.FilterStores.push(list)
            list.status=false;
            console.log(vm.FilterStores);
        }
    }

    vm.taskBtn = function(){
        console.log(vm.task)
    }

    vm.delStores = function(i){
        if(i){
            vm.FilterStores.splice(i,1)
            vm.storesList[i].status=true;
        }else{
            for(var i in vm.FilterStores){
                if(vm.FilterStores[i].check){
                    console.log(vm.storesList[i])
                    vm.storesList[i].status=true;
                    vm.storesList[i].active=false;
                    vm.FilterStores.splice(i,1);
                }
            }
        }
        
    }

    vm.StoreAll = function(){
        for(var i in vm.storesList){
            vm.storesList[i].active=true;
        }
    }

    vm.delAll = function(){
         for(var i in vm.FilterStores){
            vm.FilterStores[i].check=true;
        }
    }

    vm.TopStore = function(){
        for(var i in vm.storesList){
            if(vm.storesList[i].active){
                vm.FilterStores.push(vm.storesList[i])
                vm.storesList[i].status=false;
                vm.storesList[i].active=false;
            }
        }
    }


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
            vm.storesList = data.data.result.data
            for (var i in vm.storesList) {
                vm.storesList[i].status=true;
            }
            vm.StroesList = new NgTableParams({},{dataset:vm.storesList});   
        })
    }
}