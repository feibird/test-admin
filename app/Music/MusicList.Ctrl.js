<<<<<<< HEAD
=======
angular.module('index_area').config(config).controller('MusicListCtrl',MusicListCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider){
    $stateProvider
    .state("add", {
        url: "/music/addmusic",
        templateUrl: "Music/AddMusic.html",
        controller: 'AddMusicCtrl as AddMusicCtrl'
    })
}
MusicListCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams','MusicResource'];
/***调用接口***/
function MusicListCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams,MusicResource) {
    document.title ="语音推送管理";
    $rootScope.name="语音推送管理";
    $rootScope.childrenName="语音推送管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.getinfo;

    //获取sessionId
    login()
    list();
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

    function list(){
        MusicResource.list(vm.seid,0,0).then(function(data){            
            vm.list = data.data.result.data;
            for(var i in vm.list){
                for(var j in vm.list[i].voiceDates){
                    vm.list[i].voiceDates[j].endDate = chang_time(new Date(vm.list[i].voiceDates[j].endDate));
                    vm.list[i].voiceDates[j].startDate = chang_time(new Date(vm.list[i].voiceDates[j].startDate));
                }
            }
            console.log(vm.list)
            vm.List = new NgTableParams({},{dataset:vm.list});
        })
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
        return Y + M + D;
    }

}
>>>>>>> voice
