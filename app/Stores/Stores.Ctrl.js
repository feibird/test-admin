angular.module('index_area').config(config).controller('StoreslistCtrl',StoreslistCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider){
    $stateProvider
    .state("Virtual", {
        url: "/stores/virtual/{id:string}",
        templateUrl: "Stores/Virtual.html",
        controller: 'VirtualCtrl as VirtualCtrl'
    }).state("VirtualUpdate", {
        url: "/stores/virtualupdate{id:string}",
        templateUrl: "Stores/VirtualUpdate.html",
        controller: 'VirtualUpdateCtrl as VirtualUpdateCtrl'
    }).state("VirtualGet", {
        url: "/stores/VirtualGet{id:string}",
        templateUrl: "Stores/VirtualGet.html",
        controller: 'VirtualGetCtrl as VirtualGetCtrl'
    }).state("storesGood", {
        url: "/stores/storesGood/{id:string}&{name:string}&{brand:string}",
        templateUrl: "Stores/storesGood.html",
        controller: 'StoresGoodCtrl as StoresGoodCtrl'
    }).state("VirtualSort", {
        url: "/stores/StoresGood/{id:string}",
        templateUrl: "Stores/VirtualSort.html",
        controller: 'VirtualSortCtrl as VirtualSortCtrl'
    })
}
StoreslistCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams','BrandStoresResource'];
/***调用接口***/
function StoreslistCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams,BrandStoresResource) {
    document.title ="门店管理";
    $rootScope.name="门店管理";
    $rootScope.childrenName="门店管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.getinfo;
    vm.skip=0;
    vm.limit=10;
    vm.area = {}
    //获取sessionId
    login()
    function login(){
        vm.user=PublicResource.seid("admin");
        if(typeof(vm.user)=="undefined"){
            layer.alert("尚未登录！",{icon:2},function(index){
                layer.close(index);
                PublicResource.Urllogin();
            })
        }else{
            vm.seid = PublicResource.seid(vm.user);
        }
    }

    list();

    vm.addBtn=function(){
        console.log(vm.addinfo);
        add();
    }

    vm.delBtn = function(id){
        layer.confirm('您确定要删除门店？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id)
        });
    }

    vm.area_ser = function(id,sum){
        area(id,sum)
    }

    vm.upBtn = function(){
        update();
    }

    vm.closeLayer = function(){
        layer.closeAll();
    }

    vm.openBtn = function(status,id){
        var title,calssName;
        switch(status){
            case 'add':
                title='新增门店信息';
                calssName='.add_list';
            break;
            case 'get':
                get(id);
                title='门店信息';
                calssName='.get_list';
                console.log(vm.getinfo)
            break;
            case 'update':
                get(id);
                title='修改门店信息';
                calssName='.update_list';
                console.log(vm.getinfo)
            break;
        }

        layer.open({
		  type: 1,
		  title:title,
		  area: ['440px', '585px'], //宽高
		  content:$(calssName)
		});
    }
    function get(id){
        StoresResource.get(vm.seid,id).then(function(data){ 
            vm.getinfo = data.result;
            console.log(vm.getinfo)
        })
    }

     
    function list(){
        vm.tableParams = new NgTableParams({},{
            getData:function(params){
                vm.skip=10*(params.page()-1);
                return StoresResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
                    console.log(data.data.result);
                    params.total(data.data.result.total)
                    console.log(params.page())
                    return data.data.result.data;
                })
            }
        })
    }
    area(1,1);


    function area(id,num){
        PublicResource.getarea(vm.seid,id).then(function(data){
            switch(num){
                case 1:
                vm.area.area1 = data.result;
                break;
                case 2:
                vm.area.area2 = data.result;
                break;
                case 3:
                vm.area.area3 = data.result;
                break;
            }
        })
    }

    function add(){
        StoresResource.add(vm.seid,vm.addinfo).then(function(data){
            console.log(data);
            if(data.status=="OK"){
                layer.msg('修改成功~',{icon:1},function(){
                    layer.closeAll();
                })
                list();
            }else{
                layer.msg(data.messages,{icon:2})
            }
        })
    }

    function update(){
        StoresResource.update(vm.seid,vm.getinfo).then(function(data){
            console.log(data.data.result);
            if(data.data.status=="OK"){
                layer.msg('修改成功~',{icon:1},function(){
                    layer.closeAll();
                });
                list();
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

    function remove(id){
        StoresResource.remove(vm.seid,id).then(function(data){
            console.log(data.data.result);
            vm.list = data.data.result;
            if(data.data.status=="OK"){
                layer.msg('删除成功~',{icon:1},function(){
                    layer.closeAll();
                    list();
                })
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }
    brand();
    function brand(){
        BrandStoresResource.list(vm.seid,0,0).then(function(data){
            vm.brand = data.data.result.data;
        })
    }

}