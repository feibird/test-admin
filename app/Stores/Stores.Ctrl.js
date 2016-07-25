angular.module('index_area').controller('StoreslistCtrl',StoreslistCtrl);
StoreslistCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams'];
/***调用接口***/
function StoreslistCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams) {
    document.title ="门店管理";
    $rootScope.name="门店管理";
    $rootScope.childrenName="门店管理列表";
    var vm = this;
    vm.seid
    vm.pagecount=60;
    vm.pageint=5;
    vm.list;						//对象集合

    //获取页面坐标
    vm.index=$stateParams.index;
    PublicResource.navclass(vm.index)
    //分页点击事件
    vm.pageChanged = function(){
        PublicResource.Urllogin();
    }
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

    function list(){
        StoresResource.list(vm.seid,0,12).then(function(data){
            console.log(data.data.result);
            vm.list = data.data.result;
            console.log(vm.list.data)
            vm.tableParams = new NgTableParams({},{dataset:vm.list.data});
        })
    }

    function add(){
        StoresResource.add(seid,vm.info).then(function(data){
            console.log(data.data.result);
            if(data.data.status=="OK"){
                layer.msg('修改成功~',{icon:1})
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

    function update(){
        StoresResource.update(seid,vm.info).then(function(data){
            console.log(data.data.result);
            if(data.data.status=="OK"){
                layer.msg('修改成功~',{icon:1})
            }else{
                layer.msg(data.data.messages,{icon:2})
            }
        })
    }

    function remove(id){
        StoresResource.remove(seid,id).then(function(data){
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