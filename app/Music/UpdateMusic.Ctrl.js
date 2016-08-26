angular.module('index_area').controller('UpdateMusicCtrl',UpdateMusicCtrl);
UpdateMusicCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams'];
/***调用接口***/
function UpdateMusicCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams) {
    document.title ="语音推送管理";
    $rootScope.name="语音推送管理";
    $rootScope.childrenName="语音推送管理列表";
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

}
