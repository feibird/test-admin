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
    vm.FilterStores = new Array();      //已选择门店
    vm.GoodSpecs = new Array();
    login();

    vm.AddTask = function(){
        for(var i=0;i<$('.date').length;i++){

            vm.task[$('.date').eq(i).attr('name')] = $('.date').val();
        }
        vm.task.storeIds=""
        if(vm.task.storeType=="SELECTED_STORE"){
            vm.task.storeIds = ArryString(vm.FilterStores,true)
        }
        if(vm.task.exclusive){
            for(var i in vm.tasklist){
                
            }
        }
        if(vm.task.productType=='SELECTED_PRODUCT'){
            vm.task.productIds = ArryString(vm.specs,false)
        }
        if(typeof(vm.task.startTime)!="undefined"&&vm.task.startTime!=""&&typeof(vm.task.startTime)!='number'){
            console.log(typeof(vm.task.startTime))
            vm.task.startTime = vm.task.startTime.getTime();
        }
        if(typeof(vm.task.endTime)!="undefined"&&vm.task.endTime!=""&&typeof(vm.task.endTime)!='number'){
            console.log(vm.task.endTime)
            vm.task.endTime = vm.task.endTime.getTime();
        }
        console.log(vm.task);
         MarketResource.add(vm.seid,vm.task).then(function(data){
            if(data.data.status=="OK"){
                layer.msg("保存成功",{icon:1})
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    //
    vm.AddStores = function(list){
        if(list.status){
            vm.FilterStores.push(list)
            list.status=false;
            console.log(vm.FilterStores);
        }
    }

    //
    vm.AddSpecs = function(item){
        if(item.status){
            vm.specs.push(item)
            item.status=false;
        }
            vm.specList = new NgTableParams({},{dataset:vm.specs}); 
    }

    vm.taskBtn = function(){
        console.log(vm.task)
    }

    //删除已选择门店
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

    //删除已选择规格
    vm.delSpecs = function(i,id){
       if(i){
           for(var x in vm.GoodSpecs){
                if(vm.GoodSpecs[x].spec.id ==id){
                        console.log(vm.specs[i])
                        console.log(vm.GoodSpecs[x])
                        vm.GoodSpecs[x].status=true;
                        vm.specs.splice(i,1);
                        vm.specList = new NgTableParams({},{dataset:vm.specs});
                    }
            }
       }else{
           for(var i in vm.specs){
                if(vm.specs[i].check){
                    console.log(vm.specs[i])
                    for(var x in vm.GoodSpecs){
                        if(vm.GoodSpecs[x].spec.id==vm.specs[i].spec.id){
                            vm.GoodSpecs[x].status=true;
                        }
                    }
                    vm.specs.splice(i,1);
                }
            }
            vm.specList = new NgTableParams({},{dataset:vm.specs});
       }
    }

    vm.All = function(is){
        switch(is){
            case 'AddStore':
                for(var i in vm.storesList){
                        if(vm.storesList[i].active){
                            vm.storesList[i].active=false;
                        }else{
                            vm.storesList[i].active=true;
                        }
                    }
            break;
            case 'DelStore':
                for(var i in vm.FilterStores){
                        if(vm.FilterStores[i].check){
                            vm.FilterStores[i].check=false;
                        }else{
                            vm.FilterStores[i].check=true;
                        }
                    }
            break;
            case 'AddSpecs':
                for(var i in vm.GoodSpecs){
                        if(vm.GoodSpecs[i].active){
                            vm.GoodSpecs[i].active=false;
                        }else{
                            vm.GoodSpecs[i].active=true;
                        }
                    }
            break;
            case 'DelSpecs':
                for(var i in vm.specs){
                        if(vm.specs[i].check){
                            vm.specs[i].check=false;
                        }else{
                            vm.specs[i].check=true;
                        }
                    }
            break;
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

    vm.SpecsAll = function(){
        for(var i in vm.GoodSpecs){
            if(vm.GoodSpecs[i].active){
                vm.specs.push(vm.GoodSpecs[i])
                vm.GoodSpecs[i].status=false;
                vm.GoodSpecs[i].active=false;
            }
        }
        vm.specList = new NgTableParams({},{dataset:vm.specs});
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
    tasklist();
    function tasklist(){
        MarketResource.list(vm.seid,0,0).then(function(data){
            vm.tasklist = data.data.result;
            console.log(vm.tasklist)
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