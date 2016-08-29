angular.module('index_area').config(config).controller('StoreslistCtrl',StoreslistCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider){
    $stateProvider
    .state("Virtual", {
        url: "/stores/virtual{id:string}",
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
    }).state("VirtualGood", {
        url: "/stores/VirtualGood{id:string}",
        templateUrl: "Stores/VirtualGood.html",
        controller: 'VirtualGoodCtrl as VirtualGoodCtrl'
    }).state("VirtualSort", {
        url: "/stores/VirtualGood{id:string}",
        templateUrl: "Stores/VirtualSort.html",
        controller: 'VirtualSortCtrl as VirtualSortCtrl'
    })
}
StoreslistCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams'];
/***调用接口***/
function StoreslistCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams) {
    document.title ="门店管理";
    $rootScope.name="门店管理";
    $rootScope.childrenName="门店管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.getinfo;

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

    vm.delBtn = function(id){
        layer.confirm('您确定要删除门店？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id)
        });
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
                title='修改门店信息';
                calssName='.update_list';
            break;
        }

        layer.open({
		  type: 1,
		  title:title,
		  area: ['440px', '515px'], //宽高
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
        StoresResource.list(vm.seid,0,0).then(function(data){
            console.log(data.data.result);
            vm.list = data.data.result;
            console.log(vm.list.data)
            vm.tableParams = new NgTableParams({},{dataset:vm.list.data});
        })
    }

    function add(){
        StoresResource.add(vm.seid,vm.info).then(function(data){
            console.log(data.data.result);
            if(data.data.status=="OK"){
                layer.msg('修改成功~',{icon:1})
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

    function update(){
        StoresResource.update(vm.seid,vm.info).then(function(data){
            console.log(data.data.result);
            if(data.data.status=="OK"){
                layer.msg('修改成功~',{icon:1})
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
                layer.msg('删除成功~',{icon:1})
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

}