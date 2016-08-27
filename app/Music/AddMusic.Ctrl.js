angular.module('index_area').controller('AddMusicCtrl',AddMusicCtrl);
AddMusicCtrl.$inject = ['$rootScope','$state','PublicResource',"$stateParams",'StoresResource','NgTableParams'];
/***调用接口***/
function AddMusicCtrl($rootScope,$state,PublicResource,$stateParams,StoresResource,NgTableParams) {
    document.title ="语音推送管理";
    $rootScope.name="语音推送管理";
    $rootScope.childrenName="语音推送管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.music = new Object();
    vm.music.dates = new Array();
    vm.music.times = new Array();
    vm.stores;
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
    Stores();
    function Stores(){
        StoresResource.list(vm.seid,0,0).then(function(data){
            vm.stores = data.data.result.data;
            for(var i in vm.stores){
                vm.stores[i].status = true;
            }
            $rootScope.stores = vm.stores;
            console.log(vm.stores)
             
        })
    }
    vm.add = function(){
        console.log(vm.music)
    }

    vm.addDates = function(){
        var addlist={
            startDate:"1",
            endDate:"12"
        }
        vm.music.dates.push(addlist)
        console.log(vm.music.dates)
    }
    vm.addTimes = function(){
        var addlist={
            startTime:"1",
            endTime:"12"
        }
        vm.music.times.push(addlist)
        console.log(vm.music.dates)
    }

    $(function(){
        $("#addBtn").click(function(){
            // var list = $('.date');
            // for(var i=0;i<list.length;i++){
            //     if(list.eq(i).attr('names')=='dates'){
            //         var objName=list.eq(i).attr('name');
            //         console.log(objName)
            //         for(var j in vm.music.dates){
            //             vm.music.dates[j][objName]=list.eq(i).val();
            //         }
            //     }
            // }
            // console.log(vm.music)
            console.log($('.date').val())
        })
	})
}
